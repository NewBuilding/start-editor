import { EditorState, Plugin, TextSelection } from 'prosemirror-state';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { DOMParser, Schema } from 'prosemirror-model';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import OrderedMap from 'orderedmap';
import { allNodes } from './nodes';
import { allMarks } from './marks';
import './styles/index.less';
import { objToStyleString, DEFAULT_FONT_FAMILY, serializeToHTML, isTextSelection } from '@/utils';

import type { NodeNameEnum, CommandMap, PluginIDEnum, StyleObject } from '@/@types';
import type { MarkSpec, NodeSpec, Node as ProseMirrorNode } from 'prosemirror-model';
import type { PluginInterface } from '@/interface';

export interface EditorOptions {
  props?: DirectEditorProps;
  content: Record<string, unknown> | string;
  defaultStyles?: Record<NodeNameEnum, StyleObject>;
  plugins?: PluginInterface[];
}

export type MountTarget = HTMLElement | string;

export const shell = document.createElement('div');

export class StartEditor {
  options: EditorOptions;
  view: EditorView;
  schema: Schema;
  commandMap: CommandMap;
  plugins: Map<string, PluginInterface> = new Map();
  container: HTMLDivElement = document.createElement('div');
  wrap: HTMLDivElement = document.createElement('div');
  shell: HTMLDivElement = shell;
  editableDom: HTMLElement = document.createElement('div');
  isFocus: boolean = false;

  constructor(options: EditorOptions) {
    this.options = options;
    this.options.plugins = options.plugins || [];
    this.schema = this.createSchema();
    this.commandMap = this.createCommand();
    this.setupDom();
    this.setStartPlugins(this.options.plugins);
    this.view = new EditorView(
      {
        mount: this.editableDom,
      },
      {
        handleDOMEvents: {
          blur: () => {
            if (this.isFocus) {
              this.view.focus();
            }
            return false;
          },
        },
        state: this.createState(),
        attributes: this.docAttributes,
      },
    );
  }

  get state(): EditorState {
    return this.view.state;
  }

  /**
   * 挂载编辑器
   * @param target
   */
  mount(target: MountTarget) {
    let ele = target as HTMLElement;
    if (this.container.parentElement) {
      throw new Error('Editor has been mounted.');
    }
    if (typeof target === 'string') {
      ele = document.querySelector(target) as HTMLElement;
    }
    if (!ele) {
      throw new Error('mount target should be a html element or css selector');
    }
    ele.appendChild(this.container);
    this.view.dispatch(this.state.tr);
    this.plugins.forEach((plugin) => {
      plugin.mounted();
    });
    this.onContainerClick = this.onContainerClick.bind(this);
    this.container.addEventListener('click', this.onContainerClick);
  }

  destroy() {
    this.container.removeEventListener('click', this.onContainerClick);
    this.plugins.forEach((p) => {
      p.destroy();
    });
    this.view.destroy();
  }

  /**
   * 将编辑器中的内容导出为html string
   */
  exportHtml(): string {
    return serializeToHTML(this.state.schema, this.state.doc);
  }

  /**
   * 重新设置内容
   * @param content
   */
  setContent(content: EditorOptions['content']): void {
    this.options.content = content;
    this.view.setProps({
      state: this.createState(),
    });
  }

  getPlugin<T extends PluginInterface>(id: PluginIDEnum | string): T {
    if (!this.plugins.has(id)) {
      throw new Error('not exist the plugin which id is ' + id);
    }
    return this.plugins.get(id) as T;
  }

  /**
   * 追加插件
   * @param plugins
   */
  addPlugins(plugins: PluginInterface[]) {
    this.setStartPlugins(plugins, true);
    const state = this.state.reconfigure({
      plugins: this.getPlugins(),
    });
    this.view.updateState(state);
  }

  private onContainerClick(e: Event) {
    const oldFocus = this.isFocus;
    this.isFocus = e.target === this.shell || this.shell.contains(e.target as HTMLElement);
    if (oldFocus !== this.isFocus) {
      const tr = this.state.tr;
      if (!this.isFocus && !isTextSelection(this.state.selection)) {
        // 编辑器blur的时候取消 node select
        tr.setSelection(TextSelection.create(this.state.doc, 0));
      }
      this.view.dispatch(tr);
    }
    if (!this.isFocus) {
      this.editableDom.blur();
    }
  }

  private setStartPlugins(plugins: PluginInterface[], isAdd = false) {
    plugins.forEach((plugin) => {
      plugin.editor = this;
      // 追加的plugin会覆盖内置的plugin
      if (this.plugins.has(plugin.ID)) {
        throw new Error('Already has plugin which id is ' + plugin.ID);
      }
      if (isAdd) {
        plugin.mounted();
      }
      this.plugins.set(plugin.ID, plugin);
    });
  }

  private setupDom() {
    this.container.classList.add('start-editor');
    this.wrap.classList.add('start-editor-wrap');
    this.shell.classList.add('start-editor-shell');
    this.shell.appendChild(this.editableDom);
    this.wrap.appendChild(this.shell);
    this.container.appendChild(this.wrap);
  }

  private get docAttributes() {
    return {
      class: 'start-editor-canvas',
      style: objToStyleString({ color: 'rgb(55, 53, 47)', fontFamily: DEFAULT_FONT_FAMILY }),
    };
  }

  private createCommand() {
    const commands = {} as Record<string, Record<string, Function>>;
    const decorate = (command: Function) => (...args: any) => {
      const { view } = this;
      if (!view.editable) {
        return false;
      }
      view.focus();
      return command(...args)(view.state, view.dispatch);
    };
    [...allNodes, ...allMarks].forEach((nm) => {
      const nmCommands = (commands[nm.name] = {} as Record<string, Function>);
      Object.entries<Function>(nm.commands() as Record<string, any>).forEach(([key, val]) => {
        nmCommands[key] = decorate(val);
      });
    });
    return (commands as any) as CommandMap;
  }

  private createSchema() {
    let marks = OrderedMap.from<MarkSpec>();
    let nodes = OrderedMap.from<NodeSpec>({
      doc: {
        content: 'block+',
        toDOM: () => {
          return ['div', this.docAttributes, 0];
        },
      },
      text: {
        group: 'inline',
      },
    });
    allNodes.forEach((node) => {
      nodes = nodes.addToEnd(
        node.name,
        node.nodeSpec(this.options.defaultStyles?.[node.name as NodeNameEnum]),
      );
    });
    allMarks.forEach((mark) => {
      marks = marks.addToEnd(mark.name, mark.markSpec({}));
    });

    return new Schema({ nodes, marks });
  }

  private createState(doc?: ProseMirrorNode) {
    const {
      options: { content },
    } = this;
    if (typeof content === 'string' || !!doc) {
      // html
      if (!doc) {
        const domElement = new window.DOMParser().parseFromString(content as string, 'text/html');
        doc = DOMParser.fromSchema(this.schema).parse(domElement);
      }
      return EditorState.create({
        doc,
        plugins: this.getPlugins(),
      });
    } else {
      // json
      return EditorState.fromJSON(
        {
          schema: this.schema,
          plugins: this.getPlugins(),
        },
        content,
      );
    }
  }

  private getPlugins(): Plugin[] {
    const plugins: Plugin[] = [];
    [...allNodes, ...allMarks].forEach((nm) => {
      plugins.push(...nm.plugins());
    });

    this.plugins.forEach((p) => {
      plugins.push(...p.plugins);
    });

    return [
      history(),
      keymap({ 'Mod-z': undo, 'Mod-y': redo }),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      ...plugins,
    ];
  }
}

import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { DOMParser, Schema, MarkSpec, NodeSpec } from 'prosemirror-model';
import OrderedMap from 'orderedmap';
import { CommandMap, ProseMirrorNode } from './type';
import { allNodes } from './nodes';
import { allMarks } from './marks';
import './styles/index.less';

import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { StyleObject, NodeNameEnum } from './type';
import { objToStyleString, DEFAULT_FONT_FAMILY, serializeToHTML } from 'start-editor-utils';
import { getPlugins } from './plugins';

interface EditorOptions {
  props?: DirectEditorProps;
  content: Record<string, unknown> | string;
  defaultStyles?: Record<NodeNameEnum, StyleObject>;
  plugins?: Plugin[];
}

export type MountTarget = HTMLElement | string;

export class Editor {
  options: EditorOptions;
  view: EditorView;
  schema: Schema;
  commandMap: CommandMap;
  container: HTMLDivElement = document.createElement('div');
  wrap: HTMLDivElement = document.createElement('div');
  shell: HTMLDivElement = document.createElement('div');
  editableDom: HTMLElement = document.createElement('div');

  constructor(options: EditorOptions) {
    this.options = options;
    this.schema = this.createSchema();
    this.commandMap = this.createCommand();
    this.setupDom();
    this.view = new EditorView(
      {
        mount: this.editableDom,
      },
      {
        ...options.props,
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
    if (typeof target === 'string') {
      ele = document.querySelector(target) as HTMLElement;
    }
    if (!ele) {
      throw new Error('mount target should be a html element or css selector');
    }
    ele.appendChild(this.container);
    this.view.dispatch(this.state.tr);
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

  /**
   * 追加插件
   * @param plugins
   */
  addPlugins(plugins: Plugin[]) {
    if (!this.options.plugins) {
      this.options.plugins = plugins;
    } else {
      this.options.plugins.push(...plugins);
    }
    const state = this.state.reconfigure({
      plugins: this.getPlugins(),
    });
    this.view.updateState(state);
    // this.view.dispatch(this.state.tr);
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
    getPlugins(this).forEach((instance) => {
      plugins.push(...instance.plugins);
    });
    return [
      history(),
      keymap({ 'Mod-z': undo, 'Mod-y': redo }),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      ...plugins,
      ...(this.options.plugins || []),
    ];
  }
}

import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { DOMParser, Schema, MarkSpec, NodeSpec } from 'prosemirror-model';
import OrderedMap from 'orderedmap';
import { CommandMap } from './type';
import { allNodes, NodeName } from './nodes';
import { allMarks } from './marks';
import './styles/index.less';

import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { StyleObject } from './type';
import { objToStyleString, DEFAULT_FONT_FAMILY, serializeToHTML } from 'start-editor-utils';
import { getPlugins } from './plugins';

interface EditorOptions {
  props?: DirectEditorProps;
  content: Record<string, unknown> | string;
  defaultStyles?: Record<NodeName, StyleObject>;
  plugins?: Plugin[];
}

export class Editor {
  $el: HTMLElement;
  options: EditorOptions;
  view: EditorView;
  schema: Schema;
  commandMap: CommandMap;

  constructor(options: EditorOptions) {
    this.options = options;
    this.$el = document.createElement('div');
    this.$el.classList.add('start-editor');
    this.schema = this.createSchema();
    this.commandMap = this.createCommand();
    this.view = new EditorView(this.$el, {
      ...options.props,
      state: this.createState(),
      attributes: this.docAttributes,
    });
    window.editor = this;
  }

  get state(): EditorState {
    return this.view.state;
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
      nodes = nodes.addToEnd(node.name, node.nodeSpec(this.options.defaultStyles?.[node.name as NodeName]));
    });
    allMarks.forEach((mark) => {
      marks = marks.addToEnd(mark.name, mark.markSpec({}));
    });

    return new Schema({ nodes, marks });
  }

  private createState() {
    const {
      options: { content },
    } = this;
    if (typeof content === 'string') {
      // html
      const domElement = new window.DOMParser().parseFromString(content, 'text/html');
      const doc = DOMParser.fromSchema(this.schema).parse(domElement);
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
    getPlugins(this, {}).forEach((instance) => {
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
    this.view.setProps({
      state: this.createState(),
    });
  }
}

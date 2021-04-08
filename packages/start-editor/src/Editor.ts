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

interface EditorOptions {
  props?: DirectEditorProps;
  content: Record<string, unknown> | string;
  defaultStyles?: Record<NodeName, StyleObject>;
}

export class Editor {
  $el: HTMLElement;
  options: EditorOptions;
  view: EditorView;
  schema: Schema;
  commands: CommandMap;

  constructor(options: EditorOptions) {
    this.options = options;
    this.$el = document.createElement('div');
    this.$el.classList.add('start-editor');
    this.schema = this.createSchema();
    this.commands = this.createCommand();
    this.view = new EditorView(this.$el, {
      ...options.props,
      state: this.createState(),
      attributes: {
        class: 'start-editor-canvas',
      },
    });
  }

  get state(): EditorState {
    return this.view.state;
  }

  private createCommand() {
    const commands = {} as any;
    const decorate = (command: Function) => (...args: any) => {
      const { view } = this;
      if (!view.editable) {
        return false;
      }
      view.focus();
      return command(...args)(view.state, view.dispatch);
    };
    [...allNodes, ...allMarks].forEach((nm) => {
      Object.entries<Function>(nm.commands as Record<string, any>).forEach(([key, val]) => {
        commands[key] = decorate(val);
      });
    });
    return commands;
  }

  private createSchema() {
    let marks = OrderedMap.from<MarkSpec>();
    let nodes = OrderedMap.from<NodeSpec>({
      doc: {
        content: 'block+',
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

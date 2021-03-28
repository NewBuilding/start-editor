import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { DOMParser, Schema, MarkSpec, NodeSpec } from 'prosemirror-model';
import OrderedMap from 'orderedmap';
import { Commands } from './type';
import { allNodes } from './nodes';
import { allMarks } from './marks';

interface EditorOptions {
  props?: DirectEditorProps;
  content: Record<string, unknown> | string;
}

export class Editor {
  $el: HTMLElement;
  options: EditorOptions;
  view: EditorView;
  schema: Schema;
  commands: Commands;

  constructor(options: EditorOptions) {
    this.options = options;
    this.$el = document.createElement('div');
    this.schema = this.createSchema();
    this.commands = this.createCommand();
    this.view = new EditorView(this.$el, { ...options.props, state: this.createState() });
  }

  get state(): EditorState {
    return this.view.state;
  }

  private createCommand() {
    const commands = {} as any;
    const decorate = (command: Function, ...args: any) => {
      const { view } = this;
      if (!view.editable) {
        return false;
      }
      view.focus();
      return command(...args)(view.state, view.dispatch);
    };
    [...allNodes, ...allMarks].forEach((nm) => {
      Object.entries(nm.commands).forEach(([key, val]) => {
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
      nodes = nodes.addToEnd(node.name, node.nodeSpec);
    });
    allMarks.forEach((mark) => {
      marks = marks.addToEnd(mark.name, mark.markSpec);
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
    return [];
  }
}

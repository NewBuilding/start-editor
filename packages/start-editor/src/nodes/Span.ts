import { Plugin } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Command } from '../type';
import { getElementStyle, objToStyleString } from 'start-editor-utils';

export const SPAN_NODE_NAME = 'span';

export interface SpanCommand<T = boolean> {}

export class SpanNode extends NodeInterface<SpanCommand<Command>> {
  get name(): string {
    return SPAN_NODE_NAME;
  }

  get nodeSpec(): NodeSpec {
    const tags = ['s', 'strike', 'del', 'strong', 'b', 'i', 'em', 'u', 'span.prosemirror-span'];
    return {
      content: 'text*',
      group: 'inline',
      inline: true,
      selectable: false,
      attrs: {
        style: {
          default: {},
        },
      },
      parseDOM: tags.map((tag) => ({
        tag,
        getAttrs(dom) {
          const style = getElementStyle(dom as HTMLElement);
          return { style };
        },
      })),
      toDOM: (node) => {
        const style = objToStyleString(node.attrs.style);
        return ['span', { style, class: 'prosemirror-node-node prosemirror-span' }, 0];
      },
    };
  }

  commands(): SpanCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    throw [];
  }
}

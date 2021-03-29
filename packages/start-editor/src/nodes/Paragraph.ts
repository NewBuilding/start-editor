import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Dispatch, Command } from '../type';
import { getElementStyle, objToStyleString } from 'start-editor-utils';

export const PARAGRAPH_NODE_NAME = 'paragraph';

export interface ParagraphCommand<T = boolean> {}

export class ParagraphNode extends NodeInterface<ParagraphCommand<Command>> {
  get name(): string {
    return PARAGRAPH_NODE_NAME;
  }

  get nodeSpec(): NodeSpec {
    return {
      content: 'inline*',
      group: 'block',
      attrs: {
        style: {
          default: {
            textAlign: 'left',
          },
        },
      },
      parseDOM: [
        {
          tag: 'p',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = getElementStyle(element);
            return { style };
          },
        },
      ],
      toDOM(node) {
        const style = objToStyleString(node.attrs.style);
        return ['p', { style, class: 'prosemirror-node prosemirror-paragraph' }, 0];
      },
    };
  }

  commands(): ParagraphCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    throw [];
  }
}

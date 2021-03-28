import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Dispatch, Command } from '../type';
import {getDomNodeStyle, objToStyleString} from '../utils';

export const PARAGRAPH_NODE_NAME = 'paragraph';


export interface ParagraphCommand<T = boolean> {
}

export class ParagraphNode extends NodeInterface<ParagraphCommand<Command>> {
  get name(): string {
    return PARAGRAPH_NODE_NAME;
  }

  get nodeSpec(): NodeSpec {
    return {
      content: 'inline*',
      group: 'block',
      draggable: false,
      attrs: {
        style: {
          default: {
            textAlign: 'left',
            textIndent: '0',
          },
        },
      },
      parseDOM: [
        {
          tag: 'p',
          getAttrs(dom) {
            const style = getDomNodeStyle(dom as HTMLElement);
            return { style };
          },
        },
      ],
      toDOM(node) {
        const attrs = node.attrs;
        const style = objToStyleString(attrs.style);
        return ['p', { class: 'ProseMirror-node ProseMirror-paragraph', style }, 0];
      },
    };
  }


  commands(): ParagraphCommand<Command> {
    return {  };
  }
  plugins(): Plugin<any, any>[] {
    throw [];
  }
}

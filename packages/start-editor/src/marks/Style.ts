import { MarkSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { MarkInterface } from './MarkInterface';
import { Command } from '../type';
import { getDomNodeStyle, objToStyleString } from '../utils';

export const STYLE_MARK_NAME = 'style';

interface StyleAttrs {
  style: Partial<CSSStyleDeclaration>;
}

export interface StyleCommand<T = boolean> {
  // add(attrs: StyleAttrs): T;
  // replace(attrs: StyleAttrs): T;
}

export type StyleAction = 'merge' | 'replace';

export class StyleMark extends MarkInterface<StyleCommand<Command>> {
  get name(): string {
    return STYLE_MARK_NAME;
  }

  get markSpec(): MarkSpec {
    return {
      group: 'inline',
      isinline: true,
      attrs: {
        style: {
          default: {},
        },
      },
      parseDOM: [
        {
          tag: 'span.ProseMirror-style',
          getAttrs(dom) {
            const style = getDomNodeStyle(dom as HTMLElement);
            return {
              style,
            };
          },
        },
      ],
      toDOM(node) {
        const style = objToStyleString(node.attrs.style);
        return ['span', { style, class: 'ProseMirror-mark ProseMirror-style' }, 0];
      },
    };
  }

  plugins(): Plugin[] {
    throw new Error('Method not implemented.');
  }

  // addMark(attrs: StyleAttrs, action: StyleAction): Command {
  //   return (state, dispatch) => {
  //     dispatch?.(addMark(state, state.schema.marks.style, attrs, action));
  //     return true;
  //   };
  // }

  commands(): StyleCommand<Command> {
    return {
      // add: (attrs) => this.addMark(attrs, 'merge'),
      // replace: (attrs) => this.addMark(attrs, 'replace'),
    };
  }
}

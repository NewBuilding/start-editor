import { MarkSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { MarkInterface } from './MarkInterface';
import { Command, StyleObject } from '../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

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

  markSpec(defaultStyle: StyleObject = {}): MarkSpec {
    return {
      group: 'inline',
      isinline: true,
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: 'span.start-editor-style',
          getAttrs(dom) {
            const ele = dom as HTMLElement;
            return {
              style: styleStringToObj(ele.style.cssText, defaultStyle),
            };
          },
        },
      ],
      toDOM: (node) => {
        const style = objToStyleString(node.attrs.style);
        return ['span', { style, class: 'start-editor-mark start-editor-style' }, 0];
      },
    };
  }

  plugins(): Plugin[] {
    return [];
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

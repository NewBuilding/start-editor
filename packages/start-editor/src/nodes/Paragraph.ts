import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, StyleObject, Command } from '../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export const PARAGRAPH_NODE_NAME = 'paragraph';

export interface ParagraphCommand<T = boolean> {}

export class ParagraphNode extends NodeInterface<ParagraphCommand<Command>> {
  get name(): string {
    return PARAGRAPH_NODE_NAME;
  }

  get defaultStyle(): Partial<CSSStyleDeclaration> {
    return {
      color: 'red',
    };
  }

  nodeSpec(defaultStyle: StyleObject = { color: 'red' }): NodeSpec {
    return {
      content: 'inline*',
      group: 'block',
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: 'p',
          getAttrs: (dom) => {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, this.defaultStyle);
            return { style };
          },
        },
      ],
      toDOM: (node) => {
        return [
          'p',
          {
            style: objToStyleString(node.attrs.style),
            class: 'start-editor-node start-editor-paragraph',
          },
          0,
        ];
      },
    };
  }

  commands(): ParagraphCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

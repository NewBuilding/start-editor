import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../interface/NodeInterface';
import { NodeSpec, StyleObject, Command } from '../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export const PARAGRAPH_NODE_NAME = 'paragraph';

export interface ParagraphCommand<T = boolean> {}

export class ParagraphNode extends NodeInterface<ParagraphCommand<Command>> {
  get name(): string {
    return PARAGRAPH_NODE_NAME;
  }

  nodeSpec(
    defaultStyle: StyleObject = {
      maxWidth: '100%',
      width: '100%',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      padding: '3px 2px',
      margin: '1px 0',
    },
  ): NodeSpec {
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
          tag: '.start-editor-paragraph',
          getAttrs: (dom) => {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
        {
          tag: 'p',
          getAttrs: (dom) => {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
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

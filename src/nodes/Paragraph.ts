import { Plugin } from 'prosemirror-state';
import { NodeSpec } from 'prosemirror-model';
import { NodeInterface } from '../interface/NodeInterface';
import { StyleObject, Command, NodeNameEnum } from '../type';
import { objToStyleString, styleStringToObj } from '@/utils';

export interface ParagraphCommand<T = boolean> {}

export class ParagraphNode extends NodeInterface<ParagraphCommand<Command>> {
  get name(): string {
    return NodeNameEnum.PARAGRAPH;
  }

  nodeSpec(
    defaultStyle: StyleObject = {
      maxWidth: '100%',
      width: '100%',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      padding: '3px 0',
      margin: '2px 0',
      lineHeight: '1.5',
      fontSize: '16px',
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

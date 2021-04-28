import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export interface VerticalScrollBoxCommand<T = boolean> {}

export class VerticalScrollBoxNode extends NodeInterface<VerticalScrollBoxCommand<Command>> {
  get name(): string {
    return NodeNameEnum.VERTICAL_SCROLL_BOX;
  }

  nodeSpec(defaultStyle: StyleObject = { height: '300px' }): NodeSpec {
    return {
      content: `${NodeNameEnum.SCROLL_ITEM}+`,
      group: 'block',
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: '.start-editor-vertical_scroll_box',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
      ],
      toDOM: (node) => {
        return [
          'div',
          {
            style: objToStyleString({ ...node.attrs.style, overflowX: 'hidden', overflowY: 'auto' }),
            class: 'start-editor-node start-editor-vertical_scroll_box',
          },
          0,
        ];
      },
    };
  }

  commands(): VerticalScrollBoxCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

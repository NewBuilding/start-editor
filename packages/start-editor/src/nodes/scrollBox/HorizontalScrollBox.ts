import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export interface HorizontalScrollBoxCommand<T = boolean> {}

export class HorizontalScrollBoxNode extends NodeInterface<HorizontalScrollBoxCommand<Command>> {
  get name(): string {
    return NodeNameEnum.HORIZONTAL_SCROLL_BOX;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
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
          tag: '.start-editor-horizantal_scroll_box',
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
            style: objToStyleString({ ...node.attrs.style, display: 'flex' }),
            class: 'start-editor-node start-editor-horizantal_scroll_box',
          },
          0,
        ];
      },
    };
  }

  commands(): HorizontalScrollBoxCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

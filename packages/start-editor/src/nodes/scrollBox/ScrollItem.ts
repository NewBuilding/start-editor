import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export interface ScrollItemCommand<T = boolean> {}

export class ScrollItemNode extends NodeInterface<ScrollItemCommand<Command>> {
  get name(): string {
    return NodeNameEnum.SCROLL_ITEM;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    return {
      content: 'block+',
      attrs: {
        isHorizontal: {
          default: true,
        },
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: '.start-editor-scroll_item',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            let isHorizontal = true;
            if (element.parentElement?.classList.contains('start-editor-vertical_scroll_box')) {
              isHorizontal = false;
            }
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style, isHorizontal };
          },
        },
      ],
      toDOM: (node) => {
        const defaultStyle: StyleObject = node.attrs.isHorizontal
          ? { height: '100%', display: 'inline-block' }
          : { minWidth: '100%' };
        return [
          'div',
          {
            style: objToStyleString({ ...defaultStyle, ...node.attrs.style }),
            class: 'start-editor-node start-editor-scroll_item',
          },
          0,
        ];
      },
    };
  }

  commands(): ScrollItemCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

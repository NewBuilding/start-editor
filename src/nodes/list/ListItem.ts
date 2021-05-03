import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '../../type';
import { objToStyleString, styleStringToObj } from '@/utils';

export interface ListItemCommand<T = boolean> {}

export class ListItemNode extends NodeInterface<ListItemCommand<Command>> {
  get name(): string {
    return NodeNameEnum.LIST_ITEM;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    return {
      content: 'block+',
      group: 'block',
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: '.start-editor-list_item',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
        {
          tag: 'li',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
      ],
      toDOM: (node) => {
        return [
          'li',
          {
            style: objToStyleString(node.attrs.style),
            class: 'start-editor-node start-editor-list_item',
          },
          0,
        ];
      },
    };
  }

  commands(): ListItemCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

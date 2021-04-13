import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Dispatch, Command, StyleObject } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';
import { LIST_ITEM_NODE_NAME } from './ListItem';

export const ORDERED_LIST_NODE_NAME = 'orderedList';

export interface OrderedListCommand<T = boolean> {}

export class OrderedListNode extends NodeInterface<OrderedListCommand<Command>> {
  get name(): string {
    return ORDERED_LIST_NODE_NAME;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    return {
      content: `${LIST_ITEM_NODE_NAME}+`,
      group: 'block',
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
      ],
      toDOM: (node) => {
        return [
          'ol',
          {
            style: objToStyleString(node.attrs.style),
            class: 'start-editor-node start-editor-ordered_list',
          },
          0,
        ];
      },
    };
  }

  commands(): OrderedListCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

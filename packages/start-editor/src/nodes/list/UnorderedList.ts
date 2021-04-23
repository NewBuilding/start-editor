import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, StyleObject, Command } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';
import { LIST_ITEM_NODE_NAME } from './ListItem';

export const UNORDER_LIST_NODE_NAME = 'underedList';

export interface UnorderedListCommand<T = boolean> {}

export class UnorderedListNode extends NodeInterface<UnorderedListCommand<Command>> {
  get name(): string {
    return UNORDER_LIST_NODE_NAME;
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
          tag: '.start-editor-unordered_list',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
        {
          tag: 'ul',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
      ],
      toDOM: (node) => {
        const style = objToStyleString(node.attrs.style);
        return ['ul', { style, class: 'start-editor-node start-editor-unordered_list' }, 0];
      },
    };
  }

  commands(): UnorderedListCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

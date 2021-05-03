import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, StyleObject, Command, NodeNameEnum } from '../../type';
import { objToStyleString, styleStringToObj } from '@/utils';

export interface UnorderedListCommand<T = boolean> {}

export class UnorderedListNode extends NodeInterface<UnorderedListCommand<Command>> {
  get name(): string {
    return NodeNameEnum.UNORDER_LIST;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    return {
      content: `${NodeNameEnum.LIST_ITEM}+`,
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

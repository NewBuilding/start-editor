import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '@/@types';
import { objToStyleString, styleStringToObj } from '@/utils';
import { Schema } from 'prosemirror-model';

export interface FlexItemCommand<T = boolean> {}

export class FlexItemNode extends NodeInterface<FlexItemCommand<Command>> {
  get name(): string {
    return NodeNameEnum.FLEX_ITEM;
  }

  nodeSpec(
    defaultStyle: StyleObject = {
      flex: '1',
    },
  ): NodeSpec {
    return {
      content: 'block+',
      group: 'block flexItem',
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: '.start-editor-flex_item',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
        {
          tag: 'div,section',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            if (element.parentElement?.style.display !== 'flex') return false;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
      ],
      toDOM: (node) => {
        return [
          'div',
          {
            style: objToStyleString(node.attrs.style),
            class: 'start-editor-node start-editor-flex_item',
          },
          0,
        ];
      },
    };
  }

  commands(schema: Schema): FlexItemCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

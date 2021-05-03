import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '../type';
import { objToStyleString, styleStringToObj } from '@/utils';

export interface DividerCommand<T = boolean> {}

export class DividerNode extends NodeInterface<DividerCommand<Command>> {
  get name(): string {
    return NodeNameEnum.DIVIDER;
  }

  get defaultStyle(): Partial<CSSStyleDeclaration> {
    return {
      height: '2px',
      color: 'red',
    };
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    const getAttrs = (dom: Node | string) => {
      const element = dom as HTMLElement;
      return {
        style: styleStringToObj(element.style.cssText, defaultStyle),
      };
    };
    return {
      group: 'block',
      draggable: true,
      atom: true,
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: '.start-editor-divider',
          getAttrs,
        },
        {
          tag: 'hr',
          getAttrs,
        },
      ],
      toDOM: (node) => {
        return [
          'hr',
          {
            style: objToStyleString(node.attrs.style),
            class: 'start-editor-node start-editor-divider',
          },
        ];
      },
    };
  }

  commands(): DividerCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

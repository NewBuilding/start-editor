import { Plugin } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Command, StyleObject } from '../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export const DIVIDER_NODE_NAME = 'divider';

export interface DividerCommand<T = boolean> {}

export class DividerNode extends NodeInterface<DividerCommand<Command>> {
  get name(): string {
    return DIVIDER_NODE_NAME;
  }

  get defaultStyle(): Partial<CSSStyleDeclaration> {
    return {
      height: '2px',
      color: 'red',
    };
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
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
          tag: 'hr',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            return {
              style: styleStringToObj(element.style.cssText, defaultStyle),
            };
          },
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

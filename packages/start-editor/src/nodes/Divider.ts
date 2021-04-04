import { Plugin } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Command } from '../type';
import { objToStyleString } from 'start-editor-utils';

export const DIVIDER_NODE_NAME = 'divider';

export interface DividerCommand<T = boolean> {}

export class DividerNode extends NodeInterface<DividerCommand<Command>> {
  get name(): string {
    return DIVIDER_NODE_NAME;
  }

  get nodeSpec(): NodeSpec {
    return {
      group: 'block',
      draggable: true,
      atom: true,
      attrs: {
        style: {
          default: {},
        },
      },
      parseDOM: [
        {
          tag: 'hr',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            return {
              style: objToStyleString(element.style.cssText),
            };
          },
        },
      ],
      toDOM(node) {
        const { style } = node.attrs;

        return [
          'img',
          {
            style: objToStyleString(style),
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
    throw [];
  }
}

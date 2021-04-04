import { Plugin } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Command } from '../type';
import { objToStyleString } from 'start-editor-utils';

export const HEADING_NODE_NAME = 'heading';

export interface HeadingCommand<T = boolean> {}

export class HeadingNode extends NodeInterface<HeadingCommand<Command>> {
  HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

  get name(): string {
    return HEADING_NODE_NAME;
  }

  get nodeSpec(): NodeSpec {
    const { HEADING_LEVELS } = this;
    return {
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      attrs: {
        level: {
          default: 1,
        },
        style: {
          default: {
            textAlign: 'left',
          },
        },
      },
      parseDOM: HEADING_LEVELS.map((level) => ({
        tag: `h${level}`,
        getAttrs(dom) {
          const element = dom as HTMLElement;
          const style = objToStyleString(element.style.cssText);
          return { style, level };
        },
      })),
      toDOM(node) {
        const style = objToStyleString(node.attrs.style);
        return [`h${node.attrs.level}`, { style, class: 'start-editor-node start-editor-heading' }, 0];
      },
    };
  }

  commands(): HeadingCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    throw [];
  }
}

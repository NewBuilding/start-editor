import { Plugin } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Command, StyleObject } from '../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export const HEADING_NODE_NAME = 'heading';

export interface HeadingCommand<T = boolean> {}

export class HeadingNode extends NodeInterface<HeadingCommand<Command>> {
  HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

  get name(): string {
    return HEADING_NODE_NAME;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
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
          default: defaultStyle,
        },
      },
      parseDOM: HEADING_LEVELS.map((level) => ({
        tag: `h${level}`,
        getAttrs(dom) {
          const element = dom as HTMLElement;
          const style = styleStringToObj(element.style.cssText, defaultStyle);
          return { style, level };
        },
      })),
      toDOM: (node) => {
        return [
          `h${node.attrs.level}`,
          {
            style: objToStyleString(node.attrs.style),
            class: 'start-editor-node start-editor-heading',
          },
          0,
        ];
      },
    };
  }

  commands(): HeadingCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

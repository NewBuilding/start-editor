import { Plugin } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Command, StyleObject } from '../type';
import { objToStyleString, styleStringToObj, DEFAULT_FONT_FAMILY } from 'start-editor-utils';

export const HEADING_NODE_NAME = 'heading';

export interface HeadingCommand<T = boolean> {}

interface LevelAttr {
  level: 1 | 2 | 3 | 4 | 5;
  style: StyleObject;
}

export class HeadingNode extends NodeInterface<HeadingCommand<Command>> {
  HEADING_LEVELS: LevelAttr[] = [
    {
      level: 1,
      style: {
        fontSize: '32px',
      },
    },
    {
      level: 2,
      style: {
        fontSize: '28px',
      },
    },
    {
      level: 3,
      style: {
        fontSize: '24px',
      },
    },
    {
      level: 4,
      style: {
        fontSize: '20px',
      },
    },
    {
      level: 5,
      style: {
        fontSize: '16px',
      },
    },
  ];

  get name(): string {
    return HEADING_NODE_NAME;
  }

  nodeSpec(defaultStyle: StyleObject = { marginBottom: '4px' }): NodeSpec {
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
      parseDOM: HEADING_LEVELS.map(({ level, style }) => ({
        tag: `h${level}`,
        getAttrs(dom) {
          const element = dom as HTMLElement;
          return { style: styleStringToObj(element.style.cssText, { ...defaultStyle, ...style }), level };
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

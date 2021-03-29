import { Plugin } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Command } from '../type';
import { getElementStyle, objToStyleString, isBlockImage } from 'start-editor-utils';

export const BLOCK_IMAGE_NODE_NAME = 'blockImage';

export interface BlockImageCommand<T = boolean> {}

export class BlockImageNode extends NodeInterface<BlockImageCommand<Command>> {
  get name(): string {
    return BLOCK_IMAGE_NODE_NAME;
  }

  get nodeSpec(): NodeSpec {
    return {
      group: 'block',
      inline: false,
      draggable: true,
      atom: true,
      attrs: {
        src: {
          default: null,
        },
        alt: {
          default: null,
        },

        title: {
          default: null,
        },
        style: {
          default: {},
        },
      },
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            if (!isBlockImage(element)) return false;
            return {
              style: getElementStyle(element),
              href: element.getAttribute('href'),
              target: element.getAttribute('target'),
            };
          },
        },
      ],
      toDOM(node) {
        const { style, other } = node.attrs;
        return [
          'img',
          {
            ...other,
            style: objToStyleString(style),
            class: 'prosemirror-node prosemirror-block-image',
          },
        ];
      },
    };
  }

  commands(): BlockImageCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    throw [];
  }
}

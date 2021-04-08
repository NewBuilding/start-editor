import { Plugin } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Command, StyleObject } from '../type';
import { objToStyleString, isBlockImage, styleStringToObj } from 'start-editor-utils';

export const BLOCK_IMAGE_NODE_NAME = 'blockImage';

export interface BlockImageCommand<T = boolean> {}

export class BlockImageNode extends NodeInterface<BlockImageCommand<Command>> {
  get name(): string {
    return BLOCK_IMAGE_NODE_NAME;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
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
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            if (!isBlockImage(element)) return false;
            return {
              style: styleStringToObj(element.style.cssText, defaultStyle),
              href: element.getAttribute('href'),
              target: element.getAttribute('target'),
            };
          },
        },
      ],
      toDOM: (node) => {
        const { other } = node.attrs;
        return [
          'img',
          {
            ...other,
            style: objToStyleString(node.attrs.style),
            class: 'start-editor-node start-editor-block_image',
          },
        ];
      },
    };
  }

  commands(): BlockImageCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

import { Plugin } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Command } from '../type';
import { objToStyleString, isBlockImage } from 'start-editor-utils';

export const IMAGE_NODE_NAME = 'image';

export interface ImageCommand<T = boolean> {}

export class ImageNode extends NodeInterface<ImageCommand<Command>> {
  get name(): string {
    return IMAGE_NODE_NAME;
  }

  get nodeSpec(): NodeSpec {
    return {
      group: 'inline',
      inline: true,
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
            if (isBlockImage(element)) return false;
            return {
              style: objToStyleString(element.style.cssText),
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
            class: 'start-editor-node start-editor-image',
          },
        ];
      },
    };
  }

  commands(): ImageCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    throw [];
  }
}

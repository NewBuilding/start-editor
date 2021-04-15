import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../interface/NodeInterface';
import { NodeSpec, Command, StyleObject } from '../type';
import { objToStyleString, isBlockImage, styleStringToObj } from 'start-editor-utils';

export const IMAGE_NODE_NAME = 'image';

export interface ImageCommand<T = boolean> {}

export class ImageNode extends NodeInterface<ImageCommand<Command>> {
  get name(): string {
    return IMAGE_NODE_NAME;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    const getAttrs = (dom: Node | string) => {
      const element = dom as HTMLElement;
      if (isBlockImage(element)) return false;
      return {
        style: styleStringToObj(element.style.cssText, defaultStyle),
        src: element.getAttribute('src'),
        alt: element.getAttribute('alt'),
        title: element.getAttribute('title'),
      };
    };
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
          tag: '.start-editor-image',
          getAttrs,
        },
        {
          tag: 'img',
          getAttrs,
        },
      ],
      toDOM: (node) => {
        return [
          node.attrs.src ? 'img' : 'span',
          {
            ...node.attrs,
            style: objToStyleString(node.attrs.style),
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
    return [];
  }
}

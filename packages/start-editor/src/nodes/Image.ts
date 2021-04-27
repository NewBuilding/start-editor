import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '../type';
import { objToStyleString, isBlockImage, styleStringToObj } from 'start-editor-utils';


export interface ImageCommand<T = boolean> {}

export class ImageNode extends NodeInterface<ImageCommand<Command>> {
  get name(): string {
    return NodeNameEnum.IMAGE;
  }

  nodeSpec(defaultStyle: StyleObject = { maxHeight: '50px' }): NodeSpec {
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
        const isEmpty = !node.attrs.src;
        return [
          'div',
          {
            class: 'start-editor-node start-editor-image',
            style: objToStyleString({
              display: isEmpty ? 'none' : 'inline-block',
              fontSize: '0',
            }),
          },
          [
            node.attrs.src ? 'img' : 'span',
            {
              ...node.attrs,
              class: 'start-editor-image-content',
              style: objToStyleString(node.attrs.style),
            },
          ],
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

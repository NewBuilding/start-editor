import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '../type';
import { objToStyleString, isBlockImage, styleStringToObj } from '@/utils';

export interface BlockImageCommand<T = boolean> {}

export class BlockImageNode extends NodeInterface<BlockImageCommand<Command>> {
  get name(): string {
    return NodeNameEnum.BLOCK_IMAGE;
  }

  nodeSpec(defaultStyle: StyleObject = { width: '100%' }): NodeSpec {
    const getAttrs = (dom: Node | string) => {
      const element = dom as HTMLElement;
      if (!isBlockImage(element)) return false;
      return {
        style: styleStringToObj(element.style.cssText, defaultStyle),
        src: element.getAttribute('src'),
        alt: element.getAttribute('alt'),
        title: element.getAttribute('title'),
      };
    };
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
          tag: '.start-editor-block_image',
          getAttrs,
        },
        {
          tag: 'img',
          getAttrs,
        },
      ],
      toDOM: (node) => {
        return [
          'div',
          {
            class: 'start-editor-node start-editor-block_image',
          },
          [
            node.attrs.src ? 'img' : 'span',
            {
              ...node.attrs,
              class: 'start-editor-block_image-content',
              style: objToStyleString(node.attrs.style),
            },
          ],
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

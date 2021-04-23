import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../interface/NodeInterface';
import { NodeSpec, Command, StyleObject } from '../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export const VIDEO_NODE_NAME = 'video';

export interface VideoCommand<T = boolean> {}

export class VideoNode extends NodeInterface<VideoCommand<Command>> {
  get name(): string {
    return VIDEO_NODE_NAME;
  }

  nodeSpec(
    defaultStyle: StyleObject = {
      boxSizing: 'border-box',
      display: 'block',
      width: '100%',
      margin: '10px 0',
    },
  ): NodeSpec {
    const getAttrs = (dom: Node | string) => {
      const element = dom as HTMLElement;
      return {
        style: styleStringToObj(element.style.cssText, defaultStyle),
        src: element.getAttribute('src'),
        controls: element.hasAttribute('controls'),
      };
    };
    return {
      group: 'block',
      draggable: true,
      atom: true,
      attrs: {
        src: {
          default: '',
        },
        controls: {
          default: true,
        },
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: '.start-editor-video',
          getAttrs,
        },
        {
          tag: 'video',
          getAttrs,
        },
      ],
      toDOM: (node) => {
        const attrs = node.attrs.controls ? node.attrs : { src: node.attrs.src };
        return [
          'div',
          {
            class: 'start-editor-node start-editor-video',
            style: objToStyleString({ display: node.attrs.src ? 'block' : 'none' }),
          },
          [
            node.attrs.src ? 'video' : 'div',
            {
              ...attrs,
              class: 'start-editor-video-content',
              style: objToStyleString({ ...node.attrs.style }),
            },
          ],
        ];
      },
    };
  }

  commands(): VideoCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

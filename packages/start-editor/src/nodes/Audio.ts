import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../interface/NodeInterface';
import { NodeSpec, Command, StyleObject } from '../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export const AUDIO_NODE_NAME = 'audio';

export interface AudioCommand<T = boolean> {}

export class AudioNode extends NodeInterface<AudioCommand<Command>> {
  get name(): string {
    return AUDIO_NODE_NAME;
  }

  nodeSpec(
    defaultStyle: StyleObject = {
      boxSizing: 'border-box',
      display: 'block',
      width: '100%',
      margin: '10px 0px',
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
          tag: '.start-editor-audio',
          getAttrs,
        },
        {
          tag: 'audio',
          getAttrs,
        },
      ],
      toDOM: (node) => {
        const attrs = node.attrs.controls ? node.attrs : { src: node.attrs.src };
        return [
          'div',
          {
            class: 'start-editor-node start-editor-audio',
            style: objToStyleString({ display: node.attrs.src ? 'block' : 'none' }),
          },
          [
            node.attrs.src ? 'audio' : 'div',
            {
              ...attrs,
              class: 'start-editor-audio-content',
              style: objToStyleString({ ...node.attrs.style, padding: '0 10px' }),
            },
          ],
        ];
      },
    };
  }

  commands(): AudioCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from '../interface/NodeInterface';
import { NodeSpec, Dispatch, Command, StyleObject, NodeNameEnum } from '../type';
import { objToStyleString, styleStringToObj } from '@/utils';

interface LinkAttrs {
  href: string;
  target?: '_blank' | '_self';
}

export interface LinkCommand<T = boolean> {
  add(attrs: LinkAttrs): T;
}

export class LinkNode extends NodeInterface<LinkCommand<Command>> {
  get name(): string {
    return NodeNameEnum.LINK;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    return {
      content: 'text*',
      group: 'inline',
      inline: true,
      selectable: false,
      attrs: {
        href: {
          default: null,
        },
        target: {
          default: '_blank',
        },
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: '.start-editor-link',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            return {
              style: styleStringToObj(element.style.cssText, defaultStyle),
              href: element.getAttribute('href'),
              target: element.getAttribute('target'),
            };
          },
        },
        {
          tag: 'a[href]',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            return {
              style: styleStringToObj(element.style.cssText, defaultStyle),
              href: element.getAttribute('href'),
              target: element.getAttribute('target'),
            };
          },
        },
      ],
      toDOM: (node) => {
        return [
          'span',
          {
            class: 'start-editor-node start-editor-link',
            style: objToStyleString({ display: 'inline-flex', padding: '0 2px' }),
          },
          [
            'a',
            {
              ...node.attrs,
              class: 'start-editor-node-content',
              style: objToStyleString(node.attrs.style),
            },
            0,
          ],
        ];
      },
    };
  }

  add(): Command {
    return (state: EditorState, dispatch: Dispatch) => {
      return true;
    };
  }

  commands(): LinkCommand<Command> {
    const { add } = this;
    return { add };
  }
  plugins(): Plugin[] {
    return [];
  }
}

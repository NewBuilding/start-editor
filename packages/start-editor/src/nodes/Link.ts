import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from '../interface/NodeInterface';
import { NodeSpec, Dispatch, Command, StyleObject } from '../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export const LINK_NODE_NAME = 'link';

interface LinkAttrs {
  href: string;
  target?: '_blank' | '_self';
}

export interface LinkCommand<T = boolean> {
  add(attrs: LinkAttrs): T;
}

export class LinkNode extends NodeInterface<LinkCommand<Command>> {
  get name(): string {
    return LINK_NODE_NAME;
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
            style: 'display:inline-flex;padding: 0 5px;',
          },
          [
            'a',
            {
              ...node.attrs,
              style: objToStyleString(node.attrs.style),
              class: 'start-editor-node start-editor-link',
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

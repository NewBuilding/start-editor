import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Dispatch, Command } from '../type';
import { getElementStyle, objToStyleString } from 'start-editor-utils';

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

  get nodeSpec(): NodeSpec {
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
          default: {},
        },
      },
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            return {
              style: getElementStyle(element),
              href: element.getAttribute('href'),
              target: element.getAttribute('target'),
            };
          },
        },
      ],
      toDOM(node) {
        const style = objToStyleString(node.attrs.style);
        return [
          'a',
          {
            ...node.attrs,
            style,
            class: 'prosemirror-node prosemirror-link',
          },
          0,
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
  plugins(): Plugin<any, any>[] {
    throw [];
  }
}

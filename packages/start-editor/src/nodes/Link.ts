import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from './NodeInterface';
import { NodeSpec, Dispatch, Command } from '../type';

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
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: (dom) => ({
            href: (dom as HTMLAnchorElement).getAttribute('href'),
            target: (dom as HTMLAnchorElement).getAttribute('target') || '_blank',
          }),
        },
      ],
      toDOM: (node) => [
        'a',
        {
          ...node.attrs,
          class: 'ProseMirror-node ProseMirror-link',
          target: node.attrs.target,
        },
        0,
      ],
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

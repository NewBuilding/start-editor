import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, StyleObject } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';
import { TableRoleKey } from './Table';

export const TABLE_HEADER_NODE_NAME = 'tableHeader';

export interface TableHeaderCommand<T = boolean> {}

export class TableHeaderNode extends NodeInterface<TableHeaderCommand<Command>> {
  get name(): string {
    return TABLE_HEADER_NODE_NAME;
  }

  nodeSpec(defaultStyle: StyleObject = { border: '1px solid black' }): NodeSpec {
    const getAttrs = (_dom: any) => {
      const dom = _dom as HTMLElement;
      const style = styleStringToObj(dom.style.cssText, defaultStyle);
      const colspan = parseInt(dom.getAttribute('colspan') || '') || 1;
      const rowspan = parseInt(dom.getAttribute('rowspan') || '') || 1;

      return {
        colspan,
        rowspan,
        style,
      };
    };
    return {
      attrs: {
        colspan: {
          default: 1,
        },
        rowspan: {
          default: 1,
        },
        style: {
          default: defaultStyle,
        },
      },
      content: 'block+',
      tableRole: TableRoleKey.tableHeader,
      isolating: true,
      draggable: false,
      parseDOM: [
        {
          tag: '.start-editor-table_header',
          getAttrs,
        },
        {
          tag: 'th',
          getAttrs,
        },
      ],
      toDOM(node) {
        const attrs = node.attrs;
        const style = objToStyleString(attrs.style);

        return ['th', { ...attrs, style, class: 'start-editor-node start-editor-table_header' }, 0];
      },
    };
  }

  commands(): TableHeaderCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

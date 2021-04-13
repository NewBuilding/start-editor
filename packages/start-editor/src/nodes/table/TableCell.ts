import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, StyleObject } from '../../type';
import { styleStringToObj, objToStyleString } from 'start-editor-utils';
import { TableRoleKey } from './Table';

export const TABLE_CELL_NODE_NAME = 'tableCell';

export interface TableCellCommand<T = boolean> {}

export class TableCellNode extends NodeInterface<TableCellCommand<Command>> {
  get name(): string {
    return TABLE_CELL_NODE_NAME;
  }

  nodeSpec(defaultStyle: StyleObject = { border: '1px solid black' }): NodeSpec {
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
      tableRole: TableRoleKey.tableCell,
      isolating: true,
      draggable: false,
      parseDOM: [
        {
          tag: 'td',
          getAttrs(_dom) {
            const dom = _dom as HTMLElement;
            const style = styleStringToObj(dom.style.cssText, defaultStyle);
            const colspan = parseInt(dom.getAttribute('colspan') || '') || 1;
            const rowspan = parseInt(dom.getAttribute('rowspan') || '') || 1;

            return {
              colspan,
              rowspan,
              style,
            };
          },
        },
      ],
      toDOM: (node) => {
        const attrs = node.attrs;
        return ['td', { ...attrs, style: objToStyleString(attrs.style) }, 0];
      },
    };
  }

  commands(): TableCellCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

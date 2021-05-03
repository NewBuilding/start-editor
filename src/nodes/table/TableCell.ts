import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '@/@types';
import { styleStringToObj, objToStyleString } from '@/utils';
import { TableRoleKey } from './Table';

export interface TableCellCommand<T = boolean> {}

export class TableCellNode extends NodeInterface<TableCellCommand<Command>> {
  get name(): string {
    return NodeNameEnum.TABLE_CELL;
  }

  nodeSpec(defaultStyle: StyleObject = { border: '1px solid black' }): NodeSpec {
    const getAttrs = (_dom: Node | string) => {
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
      tableRole: TableRoleKey.tableCell,
      isolating: true,
      draggable: false,
      parseDOM: [
        {
          tag: '.start-editor-table_cell',
          getAttrs,
        },
        {
          tag: 'td',
          getAttrs,
        },
      ],
      toDOM: (node) => {
        const attrs = node.attrs;
        return [
          'td',
          {
            ...attrs,
            style: objToStyleString(attrs.style),
            class: 'start-editor-node start-editor-table_cell',
          },
          0,
        ];
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

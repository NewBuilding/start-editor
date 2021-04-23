import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, ProseMirrorNode, Schema, StyleObject } from '../../type';
import { TABLE_ROW_NODE_NAME } from './TableRow';
import { styleStringToObj, objToStyleString } from 'start-editor-utils';
import { NodeType, Fragment } from 'prosemirror-model';

export const TABLE_NODE_NAME = 'table';

export enum TableRoleKey {
  tableCell = 'cell',
  tableRow = 'row',
  tableHeader = 'header_cell',
  table = 'table',
}

export interface TableCommand<T = boolean> {}

export class TableNode extends NodeInterface<TableCommand<Command>> {
  get name(): string {
    return TABLE_NODE_NAME;
  }

  nodeSpec(
    defaultStyle: StyleObject = {
      width: '99%',
      borderCollapse: 'collapse',
    },
  ): NodeSpec {
    return {
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      content: `${TABLE_ROW_NODE_NAME}+`,
      tableRole: TableRoleKey.table,
      draggable: false,
      group: 'block',
      parseDOM: [
        {
          tag: '.start-editor-table',
          getAttrs(_dom) {
            const dom = _dom as HTMLElement;

            return { style: styleStringToObj(dom.style.cssText, defaultStyle) };
          },
        },
        {
          tag: 'table',
          getAttrs(_dom) {
            const dom = _dom as HTMLElement;

            return { style: styleStringToObj(dom.style.cssText, defaultStyle) };
          },
        },
      ],
      toDOM: (node) => {
        const style = objToStyleString(node.attrs.style);
        return ['table', { style, class: 'start-editor-node start-editor-table' }, ['tbody', 0]];
      },
    };
  }

  commands(): TableCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

type Content = Fragment | ProseMirrorNode | ProseMirrorNode[] | null;
type TableNodeTypeMap = { [key in TableRoleKey]: NodeType };

function createCell(cellType: NodeType, cellContent: Content) {
  if (cellContent) {
    return cellType.createChecked(null, cellContent);
  }

  return cellType.createAndFill();
}

function getTableNodeTypes(schema: Schema): TableNodeTypeMap {
  if (schema.cached.tableNodeTypes) {
    return schema.cached.tableNodeTypes;
  }

  const roles: Record<string, any> = {};

  Object.keys(schema.nodes).forEach((type) => {
    const nodeType = schema.nodes[type];

    if (nodeType.spec.tableRole) {
      roles[nodeType.spec.tableRole] = nodeType;
    }
  });

  schema.cached.tableNodeTypes = roles;

  return roles as TableNodeTypeMap;
}

function createTable(
  schema: Schema,
  rowsCount: number,
  colsCount: number,
  withHeaderRow: boolean,
  cellContent: Content = null,
) {
  const types = getTableNodeTypes(schema);

  const headerCells = [];
  const cells = [];

  for (let index = 0; index < colsCount; index += 1) {
    const cell = createCell(types.cell, cellContent);

    if (cell) {
      cells.push(cell);
    }

    if (withHeaderRow) {
      const headerCell = createCell(types.header_cell, cellContent);

      if (headerCell) {
        headerCells.push(headerCell);
      }
    }
  }

  const rows = [];

  for (let index = 0; index < rowsCount; index += 1) {
    rows.push(types.row.createChecked(null, withHeaderRow && index === 0 ? headerCells : cells));
  }

  return types.table.createChecked(null, rows);
}

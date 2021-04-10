import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../NodeInterface';
import { NodeSpec, Command, StyleObject } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';
import { TableRoleKey } from './Table';
import { TABLE_CELL_NODE_NAME } from './TableCell';
import { TABLE_HEADER_NODE_NAME } from './TableHeader';

export const TABLE_ROW_NODE_NAME = 'tableRow';

export interface TableRowCommand<T = boolean> {}

export class TableRowNode extends NodeInterface<TableRowCommand<Command>> {
  get name(): string {
    return TABLE_ROW_NODE_NAME;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    return {
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      content: `(${TABLE_CELL_NODE_NAME} | ${TABLE_HEADER_NODE_NAME})+`,
      tableRole: TableRoleKey.tableRow,
      draggable: false,
      parseDOM: [
        {
          tag: 'tr',
          getAttrs: (_dom) => {
            const dom = _dom as HTMLElement;
            const style = styleStringToObj(dom.style.cssText, defaultStyle);

            return {
              style,
            };
          },
        },
      ],
      toDOM(node) {
        const attrs = node.attrs;
        const style = objToStyleString(attrs.style);

        return ['tr', { style }, 0];
      },
    };
  }

  commands(): TableRowCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}

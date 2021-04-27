import { Plugin } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Command, StyleObject, NodeNameEnum } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';
import { TableRoleKey } from './Table';

export interface TableRowCommand<T = boolean> {}

export class TableRowNode extends NodeInterface<TableRowCommand<Command>> {
  get name(): string {
    return NodeNameEnum.TABLE_ROW;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    return {
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      content: `(${NodeNameEnum.TABLE_CELL} | ${NodeNameEnum.TABLE_HEADER})+`,
      tableRole: TableRoleKey.tableRow,
      draggable: false,
      parseDOM: [
        {
          tag: '.start-editor-table_row',
          getAttrs: (_dom) => {
            const dom = _dom as HTMLElement;
            const style = styleStringToObj(dom.style.cssText, defaultStyle);

            return {
              style,
            };
          },
        },
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

        return ['tr', { style, class: 'start-editor-node start-editor-table_row' }, 0];
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

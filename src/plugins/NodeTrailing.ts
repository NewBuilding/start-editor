import { Plugin } from 'prosemirror-state';
import { PluginInterface } from '../interface';
import { NodeNameEnum, PluginIDEnum } from '@/@types';

export interface NodeTrailingOptions {
  // 要追加的node
  addNode: string;
  // 当以这个数组中node结尾时不追加 addNode
  notAdd: string[];
}
/**
 * 自动在文档最后追加一行
 */
export class NodeTrailingPlugin extends PluginInterface<NodeTrailingOptions> {
  ID = PluginIDEnum.NODE_TRALLING;

  get defaultOptions(): NodeTrailingOptions {
    return {
      // 要添加的node的类型
      addNode: NodeNameEnum.PARAGRAPH,
      // 当最后一个node的类型在这个数组中时，不会再追加node
      notAdd: [NodeNameEnum.PARAGRAPH],
    };
  }
  get plugins() {
    const { addNode, notAdd } = this.options;
    const nodeTrallingPlugin = new Plugin({
      state: {
        init: (_, state) => {
          const lastNode = state.tr.doc.lastChild;
          if (!lastNode) return false;
          return !notAdd.includes(lastNode.type.name);
        },
        apply: (tr, old) => {
          if (!tr.docChanged) {
            return old;
          }
          const lastNode = tr.doc.lastChild;
          if (!lastNode) return false;
          return !notAdd.includes(lastNode.type.name);
        },
      },
      view() {
        return {
          update(view) {
            const { state } = view;
            const insertNodeAtEnd = nodeTrallingPlugin.getState(state);
            if (!insertNodeAtEnd) {
              return;
            }
            const { doc, schema, tr } = state;
            const type = schema.nodes[addNode];
            view.dispatch(tr.insert(doc.content.size, type.create()));
          },
        };
      },
    });
    return [nodeTrallingPlugin];
  }
}

import { Plugin, PluginKey } from 'prosemirror-state';
import { PluginInterface } from '../interface';

const trailingNodeKey = new PluginKey('trailingNode');

export interface TrailingNodeOptions {
  // 要追加的node
  addNode: string;
  // 当以这个数组中node结尾时不追加 addNode
  notAdd: string[];
}
/**
 * 自动在文档最后追加一行
 */
export class TrailingNodePlugin extends PluginInterface<TrailingNodeOptions> {
  get defaultOptions(): TrailingNodeOptions {
    return {
      addNode: 'paragraph',
      notAdd: ['paragraph'],
    };
  }
  get plugins() {
    const { addNode, notAdd } = this.options;
    return [
      new Plugin({
        key: trailingNodeKey,
        view: () => ({
          update: (view) => {
            const { state } = view;
            const insertNodeAtEnd = trailingNodeKey.getState(state);

            if (!insertNodeAtEnd) {
              return;
            }
            const { doc, schema, tr } = state;
            const type = schema.nodes[addNode];
            view.dispatch(tr.insert(doc.content.size, type.create()));
          },
        }),
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
      }),
    ];
  }
}

import { Decoration, DecorationSet } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import { PluginInterface } from '../interface';
import { NodeName } from '../nodes';

const nodeEmptyClass = 'start-editor-node--empty';
const editorEmptyClass = 'start-editor--empty';

const ignodeNode: NodeName[] = ['image', 'blockImage', 'video', 'audio'];

export class PlaceholderPlugin extends PluginInterface {
  get plugins() {
    return [
      new Plugin({
        props: {
          decorations: (state) => {
            console.log(state);
            const { doc, selection } = state;
            const editable = this.editor.view?.editable;
            if (!editable) {
              return DecorationSet.empty;
            }
            const { anchor } = selection;
            const decorations: Decoration[] = [];
            const isEditorEmpty = doc.textContent.length === 0;

            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
              const isNodeEmpty = node.content.size === 0;
              if (hasAnchor && isNodeEmpty && !ignodeNode.includes(node.type.name as NodeName)) {
                const classes = [nodeEmptyClass];

                if (isEditorEmpty) {
                  classes.push(editorEmptyClass);
                }

                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(' '),
                });
                decorations.push(decoration);
              }
              return false;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  }
}

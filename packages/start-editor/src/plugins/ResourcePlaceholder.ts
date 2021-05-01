import { Decoration, DecorationSet } from 'prosemirror-view';
import { Plugin, EditorState } from 'prosemirror-state';
import { PluginInterface } from '../interface';
import { Placeholder } from '../components';
import { NodeNameEnum } from '../type';

const placeholderNode: NodeNameEnum[] = [
  NodeNameEnum.IMAGE,
  NodeNameEnum.BLOCK_IMAGE,
  NodeNameEnum.VIDEO,
  NodeNameEnum.AUDIO,
];

export class ResourcePlaceholderPlugin extends PluginInterface {
  get id() {
    return 'ResourcePlaceholder';
  }
  get plugins() {
    return [
      new Plugin<DecorationSet>({
        state: {
          init(config, state) {
            return getDecorations(state);
          },
          apply: (tr, old, state) => {
            if (tr.docChanged) {
              return getDecorations(state);
            }
            return old;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  }
}

function getDecorations(state: EditorState) {
  const decorations: Decoration[] = [];
  state.doc.descendants((node, pos) => {
    if (!node.attrs.src && placeholderNode.includes(node.type.name as NodeNameEnum)) {
      const decoration = Decoration.widget(pos, () => {
        const instance = Placeholder({ type: node.type.name as any });
        return instance;
      });
      decorations.push(decoration);
    }
  });
  return DecorationSet.create(state.doc, decorations);
}

import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import { PluginInterface } from '../interface';
import { NodeName } from '../nodes';
import { Placeholder } from '../components';

export const placeholderNode: NodeName[] = ['image', 'blockImage', 'video', 'audio'];

let inited = false;

export class ResourcePlaceholderPlugin extends PluginInterface {
  get plugins() {
    return [
      new Plugin<DecorationSet>({
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, old) {
            const decorationSet = tr.getMeta('decorationSet');
            return decorationSet || old;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
        view: () => {
          return {
            update: (view, lastState) => {
              if (view.state.doc === lastState.doc && inited) return;
              inited = true;
              view.dispatch(view.state.tr.setMeta('decorationSet', getDecorations(view)));
            },
          };
        },
      }),
    ];
  }
}

function getDecorations(view: EditorView) {
  const { state } = view;
  const decorations: Decoration[] = [];
  state.doc.descendants((node, pos) => {
    if (!node.attrs.src && placeholderNode.includes(node.type.name as NodeName)) {
      const decoration = Decoration.widget(pos, () => {
        const instance = Placeholder({ type: node.type.name as any });
        return instance;
      });
      decorations.push(decoration);
    }
  });
  return DecorationSet.create(state.doc, decorations);
}

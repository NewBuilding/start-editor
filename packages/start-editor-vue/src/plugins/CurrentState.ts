import { Plugin, PluginKey, Selection, NodeSelection } from 'prosemirror-state';
import { getParentElementByClassName, elementHasClassNames, getNodeByEvent } from 'start-editor-utils';
import { PluginInterface, ProseMirrorNode } from 'start-editor';

export interface CurrentState {
  // 当前hover位置对应的 ResolvedPos
  hoverNode: ProseMirrorNode | null;
  // 当前hover的dom元素
  hoverDom: HTMLElement | null;
}

const KEY_NAME = 'activeState';
export const currentStateKey = new PluginKey<CurrentState>(KEY_NAME);

// hover 到关键字 链接元素时忽略，取它父元素
const ignoreClassList = ['start-editor-span', 'start-editor-link'];

export class CurrentStatePlugin extends PluginInterface {
  get name() {
    return KEY_NAME;
  }

  get plugins(): Plugin[] {
    return [
      new Plugin<CurrentState>({
        key: currentStateKey,
        props: {
          handleDOMEvents: {
            mouseover: (view, event) => {
              const element = getParentElementByClassName(
                event.target as HTMLElement,
                'ProseMirror-node',
                (dom) => {
                  for (const classname of ignoreClassList) {
                    if (dom.classList.contains(classname)) {
                      return true;
                    }
                  }
                  return false;
                },
              );
              let hoverNode = null;
              if (element) {
                const pos = view.posAtDOM(element, 0);
                const resolvedPos = view.state.doc.resolve(pos);
                // inline node
                if (elementHasClassNames(element, ['start-editor-image'])) {
                  hoverNode = resolvedPos.nodeAfter;
                } else if (
                  elementHasClassNames(element, [
                    'start-editor-block_image',
                    'start-editor-video',
                    'start-editor-audio',
                  ])
                ) {
                  // atom node
                  const selection = Selection.findFrom(resolvedPos, 1);
                  hoverNode = selection instanceof NodeSelection ? selection.node : null;
                } else {
                  // 非 atom node
                  hoverNode = resolvedPos.parent;
                }
              }
              const tr = view.state.tr.setMeta('hoverDom', element);
              tr.setMeta('hoverNode', hoverNode);
              view.dispatch(tr);
              return false;
            },
          },
        },
        state: {
          init() {
            return {
              hoverDom: null,
              hoverNode: null,
            };
          },
          apply(tr, old) {
            let hoverDom = tr.getMeta('hoverDom');
            let hoverNode = tr.getMeta('hoverNode');
            if (hoverDom === undefined) {
              hoverDom = old.hoverDom;
              hoverNode = old.hoverNode;
            }
            return {
              hoverDom,
              hoverNode,
            };
          },
        },
      }),
    ];
  }
}

import { Plugin, PluginKey } from 'prosemirror-state';
import { ResolvedPos } from 'prosemirror-model';
import { getParentElementByClassName } from 'start-editor-utils';
import { PluginInterface } from 'start-editor';

export interface CurrentState {
  // 当前hover位置对应的 ResolvedPos
  hoverResolvedPos: ResolvedPos | null;
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
              let resolvedPos = null;
              if (element) {
                const pos = view.posAtDOM(element, 0);
                resolvedPos = view.state.doc.resolve(pos);
              }

              const tr = view.state.tr.setMeta('hoverDom', element);
              tr.setMeta('hoverResolvedPos', resolvedPos);
              view.dispatch(tr);
              return false;
            },
          },
        },
        state: {
          init() {
            return {
              hoverDom: null,
              hoverResolvedPos: null,
            };
          },
          apply(tr, old) {
            let hoverDom = tr.getMeta('hoverDom');
            let hoverResolvedPos = tr.getMeta('hoverResolvedPos');
            if (hoverDom === undefined) {
              hoverDom = old.hoverDom;
              hoverResolvedPos = old.hoverResolvedPos;
            }
            return {
              hoverDom,
              hoverResolvedPos,
            };
          },
        },
      }),
    ];
  }
}

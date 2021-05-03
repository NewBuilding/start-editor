import { Plugin, EditorState, Selection, NodeSelection } from 'prosemirror-state';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import Popper, { createPopper as _createPopper } from '@popperjs/core';
import {
  getParentElementByClassName,
  elementHasClassNames,
  getRelatviePosition,
  setElementRect,
} from 'start-editor-utils';
import { PluginInterface } from 'start-editor';
import { throttle } from 'lodash';
import { PluginIDEnum } from '../type';

export interface PopperAnchorOptions {
  // 在这个数组中的node，在hover时忽略，取它的父node
  ignoreClassList: string[];
  // hover node anchor 的classname
  anchorClassName: string;
}

export interface HoverNodeAnchorState {
  // 当前hover位置对应的 ResolvedPos
  hoverNode: ProseMirrorNode | null;
  // 当前hover的dom元素
  hoverDom: HTMLElement | null;
}

export interface CreatePopperOptions {
  placement?: Popper.Options['placement'];
  modifiers?: Popper.Options['modifiers'];
  offset?: [number, number];
}

/**
 *
 * 创建一个辅助element，改元素的位置和大小与当前hover node对应的dom一致，
 * 通过该element可以实现在当前hover元素附近显示一个菜单的功能，比如块前菜单
 *
 */
export class HoverNodeAnchorPlugin extends PluginInterface<PopperAnchorOptions> {
  ID = PluginIDEnum.HOVER_NODE_ANCHOR;

  // 当前hover元素的锚
  anchor = document.createElement('div');

  popperInstances: Popper.Instance[] = [];

  get defaultOptions(): PopperAnchorOptions {
    return {
      ignoreClassList: ['start-editor-span', 'start-editor-link'],
      anchorClassName: 'start-editor-hover_node_anchor',
    };
  }

  get plugins(): Plugin[] {
    return [this.plugin];
  }

  plugin = new Plugin<HoverNodeAnchorState>({
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
    props: {
      handleDOMEvents: {
        mouseover: (view, event) => {
          const { ignoreClassList } = this.options;
          const element = getParentElementByClassName(
            event.target as HTMLElement,
            'start-editor-node',
            (dom) => elementHasClassNames(dom, ignoreClassList),
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
          this.throttleUpdate(view.state);
          return false;
        },
      },
    },
  });

  mounted() {
    const ele = this.anchor;
    ele.classList.add(this.options.anchorClassName);
    ele.style.position = 'absolute';
    ele.style.zIndex = '-1';
    this.editor.shell.append(ele);
  }

  destroy() {
    this.popperInstances.splice(0, this.popperInstances.length);
    this.editor.shell.removeChild(this.anchor);
  }

  /**
   *  创建一个鼠标hover位置变化的Popper
   * @param tooltip 基于光标位置移动的tooltip
   * @param options popper配置项
   */
  createPopper(tooltip: HTMLElement, options?: CreatePopperOptions): Popper.Instance {
    options = Object.assign(
      {},
      {
        placement: 'auto-start',
        offset: [0, 8],
        modifiers: [],
      },
      options,
    );
    if (!options.modifiers?.find((modifier) => modifier.name === 'offset')) {
      options.modifiers = options.modifiers || [];
      options.modifiers.push({
        name: 'offset',
        options: {
          offset: options.offset,
        },
      });
    }

    const instance = _createPopper(this.anchor, tooltip, options);
    this.popperInstances.push(instance);
    return instance;
  }

  getState(state: EditorState): HoverNodeAnchorState {
    return this.plugin.getState(state);
  }

  private throttleUpdate = throttle(
    (state: EditorState) => {
      this.updateAnchor(state);
      this.popperInstances.forEach((instance) => {
        instance.update();
      });
    },
    200,
    { leading: false, trailing: true },
  );

  private updateAnchor(state: EditorState) {
    const element = this.getState(state)?.hoverDom;
    if (!element) return;
    const relativePos = getRelatviePosition(this.editor.editableDom, element);

    setElementRect(this.anchor, {
      left: relativePos.left,
      top: relativePos.top,
      width: element.clientWidth,
      height: element.clientHeight,
    });
  }
}

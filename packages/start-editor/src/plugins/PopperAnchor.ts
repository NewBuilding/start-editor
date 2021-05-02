/* eslint-disable indent */
import { Plugin, EditorState, Selection, NodeSelection } from 'prosemirror-state';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';
import Popper, { createPopper as _createPopper } from '@popperjs/core';
import {
  coordsAtPos,
  getClosestParent,
  getParentElementByClassName,
  elementHasClassNames,
  getRelatviePosition,
  setElementRect,
} from 'start-editor-utils';
import { PluginInterface } from 'start-editor';
import { throttle } from 'lodash';
import { BoxRect, PluginIDEnum } from '../type';
import type { CurrentStatePlugin } from './CurrentState';

const defaultOptions: Partial<Popper.Options> = {
  placement: 'right-start',
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
  ],
};

export interface PopperAnchorOptions {
  // 在这个列表中的node，在hover时忽略，取它的父node
  ignoreClassList: string[];
}

export interface CurrentState {
  // 当前hover位置对应的 ResolvedPos
  hoverNode: ProseMirrorNode | null;
  // 当前hover的dom元素
  hoverDom: HTMLElement | null;
}

export enum PopperType {
  BASE_NODE = 'base_node',
  BASE_TEXT = 'base_text',
  BASE_HOVER_NODE = 'base_hover_node',
}

/**
 *
 * 创建一个辅助元素，该元素的位置和高度与光标的一致
 *
 */
export class PopperAnchorPlugin extends PluginInterface<PopperAnchorOptions> {
  ID = PluginIDEnum.POPPER_ANCHAOR;

  // 锚，表征光标的位置和高度
  textAnchor = document.createElement('div');

  // 锚，定位当前光标最近的父 block node
  nodeAnchor = document.createElement('div');

  // 当前hover元素的锚
  hoverNodeAnchor = document.createElement('div');

  viewPopperInstances: Popper.Instance[] = [];
  eventPopperInstance: Popper.Instance[] = [];

  anchors = [
    { ele: this.textAnchor, classname: 'anchor-text' },
    { ele: this.nodeAnchor, classname: 'anchor-node' },
    { ele: this.hoverNodeAnchor, classname: 'anchor-hover_node' },
  ];

  get defaultOptions(): PopperAnchorOptions {
    return {
      ignoreClassList: ['start-editor-span', 'start-editor-link'],
    };
  }

  private throttleUpdate = throttle((view) => {
    this.updateTextAnchor(view);
    this.updateNodeAnchor(view);
    this.viewPopperInstances.forEach((instance) => {
      instance.update();
    });
  }, 200);

  private throttleUpdateHoverNode = throttle((state: EditorState) => {
    this.updateHoverNodeAnchor(state);
    this.eventPopperInstance.forEach((instance) => {
      instance.update();
    });
  }, 200);

  mount() {
    this.anchors.forEach(({ ele, classname }) => {
      ele.classList.add(classname);
      ele.style.position = 'absolute';
      ele.style.zIndex = '-1';
      this.editor.container.append(ele);
    });
  }

  destroy() {
    const container = this.editor.container;
    this.viewPopperInstances.splice(0, this.viewPopperInstances.length);
    this.anchors.forEach(({ ele }) => {
      if (container.contains(ele)) {
        container.removeChild(ele);
      }
    });
  }

  /**
   *  创建一个基于光标位置变化的tootip
   * @param tooltip 基于光标位置移动的tooltip
   * @param options popper配置项
   */
  createPopper(
    tooltip: HTMLElement,
    options: Partial<Popper.Options> = defaultOptions,
    type: PopperType = PopperType.BASE_TEXT,
  ): Popper.Instance {
    let anchor = this.textAnchor;
    switch (type) {
      case PopperType.BASE_TEXT:
        anchor = this.textAnchor;
        break;
      case PopperType.BASE_NODE:
        anchor = this.nodeAnchor;
        break;
      case PopperType.BASE_HOVER_NODE:
        anchor = this.hoverNodeAnchor;
        break;
    }
    const instance = _createPopper(anchor, tooltip, options);
    // 基于view update更新和基于event更新的popper instance要分开
    if (type === PopperType.BASE_HOVER_NODE) {
      this.eventPopperInstance.push(instance);
    } else {
      this.viewPopperInstances.push(instance);
    }

    return instance;
  }

  get plugin() {
    const update = this.throttleUpdate.bind(this);
    const { ignoreClassList } = this.options;
    return new Plugin({
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
            const element = getParentElementByClassName(
              event.target as HTMLElement,
              'ProseMirror-node',
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

            this.throttleUpdateHoverNode(view.state);
            return false;
          },
        },
      },
      view() {
        return {
          update,
        };
      },
    });
  }

  get plugins(): Plugin[] {
    return [this.plugin];
  }

  private updateHoverNodeAnchor(state: EditorState) {
    const plugin = this.editor.getPlugin<CurrentStatePlugin>(PluginIDEnum.CURRENT_STATE);
    const element = plugin.getState(state).hoverDom;
    if (!element) return;
    const relativePos = getRelatviePosition(this.editor.editableDom, element);

    setElementRect(this.hoverNodeAnchor, {
      left: relativePos.left,
      top: relativePos.top,
      width: element.clientWidth,
      height: element.clientHeight,
    });
  }

  private updateTextAnchor(view: EditorView) {
    const {
      state: { selection },
    } = view;
    const fromCoords = coordsAtPos(view, selection.from);
    const toCoords = coordsAtPos(view, selection.to, true);
    const relativePos = getRelativePos(fromCoords, this.editor.editableDom);
    setElementRect(this.textAnchor, {
      left: relativePos.left,
      top: relativePos.top,
      width: Math.max(toCoords.left - fromCoords.left, 1),
      height: toCoords.bottom - fromCoords.top,
    });
  }

  private updateNodeAnchor(view: EditorView) {
    const { state } = view;
    const nodeInfo = getClosestParent(state);
    if (!nodeInfo) return;
    const dom = view.nodeDOM(nodeInfo.pos) as HTMLElement;
    const relativePos = getRelativePos(view.coordsAtPos(nodeInfo.pos), this.editor.editableDom);
    setElementRect(this.textAnchor, {
      left: relativePos.left,
      top: relativePos.top,
      width: dom.clientWidth,
      height: dom.clientHeight,
    });
  }
}

function getRelativePos(coords: BoxRect, container: HTMLElement) {
  if (!container) return coords;
  const rect = container.getBoundingClientRect();
  return {
    left: coords.left - rect.left,
    top: coords.top - rect.top,
  };
}

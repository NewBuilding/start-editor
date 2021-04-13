/* eslint-disable indent */
import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import Popper, { createPopper as _createPopper } from '@popperjs/core';
import { coordsAtPos, getClosestParent, getRelatviePosition, px } from 'start-editor-utils';
import { PluginInterface } from 'start-editor';
import { throttle } from 'lodash';
import { currentStateKey } from './CurrentState';
import { Coords } from '../type';

// 锚，表征光标的位置和高度
export const textAnchor = document.createElement('div');

// 锚，定位当前光标最近的父 block node
export const nodeAnchor = document.createElement('div');

// 当前hover元素的锚
export const hoverNodeAnchor = document.createElement('div');

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

const viewPopperInstances: Popper.Instance[] = [];
const eventPopperInstance: Popper.Instance[] = [];

const anchors = [
  { ele: textAnchor, classname: 'anchor-text' },
  { ele: nodeAnchor, classname: 'anchor-node' },
  { ele: hoverNodeAnchor, classname: 'anchor-hover_node' },
];

export enum PopperType {
  BASE_NODE = 'base_node',
  BASE_TEXT = 'base_text',
  BASE_HOVER_NODE = 'base_hover_node',
}

/**
 *  创建一个基于光标位置变化的tootip
 * @param tooltip 基于光标位置移动的tooltip
 * @param options popper配置项
 */
export function createPopper(
  tooltip: HTMLElement,
  options: Partial<Popper.Options> = defaultOptions,
  type: PopperType = PopperType.BASE_TEXT,
): Popper.Instance {
  let anchor = textAnchor;
  switch (type) {
    case PopperType.BASE_TEXT:
      anchor = textAnchor;
      break;
    case PopperType.BASE_NODE:
      anchor = nodeAnchor;
      break;
    case PopperType.BASE_HOVER_NODE:
      anchor = hoverNodeAnchor;
      break;
  }
  const instance = _createPopper(anchor, tooltip, options);
  // 基于view update更新和基于event更新的popper instance要分开
  if (type === PopperType.BASE_HOVER_NODE) {
    eventPopperInstance.push(instance);
  } else {
    viewPopperInstances.push(instance);
  }

  return instance;
}

function mount(container: HTMLElement) {
  anchors.forEach(({ ele, classname }) => {
    ele.classList.add(classname);
    ele.style.position = 'absolute';
    ele.style.zIndex = '-1';
    container.append(ele);
  });
}

function unmount(container: HTMLElement) {
  viewPopperInstances.splice(0, viewPopperInstances.length);
  anchors.forEach(({ ele }) => {
    if (container.contains(ele)) {
      container.removeChild(ele);
    }
  });
}

function update() {
  viewPopperInstances.forEach((instance) => {
    instance.update();
  });
}

function updateHoverNode() {
  eventPopperInstance.forEach((instance) => {
    instance.update();
  });
}

function getRelativePos(coords: Coords, container: HTMLElement) {
  if (!container) return coords;
  const rect = container.getBoundingClientRect();
  return {
    left: coords.left - rect.left,
    top: coords.top - rect.top,
  };
}

const inited = false;

const PLUGIN_NAME = 'cursor-popper';

/**
 *
 * 创建一个辅助元素，该元素的位置和高度与光标的一致
 *
 */
export class AnchorPopperPlugin extends PluginInterface {
  throttleUpdate = throttle((view) => {
    this.updateTextAnchor(view);
    this.updateNodeAnchor(view);
    update();
  }, 200);

  throttleUpdateHoverNode = throttle((state: EditorState) => {
    this.updateHoverNodeAnchor(state);
    updateHoverNode();
  }, 200);

  get plugins(): Plugin[] {
    const update = this.update.bind(this);
    const destroy = this.destroy.bind(this);
    return [
      new Plugin({
        key: new PluginKey(PLUGIN_NAME),
        props: {
          handleDOMEvents: {
            mouseover: (view, event) => {
              this.throttleUpdateHoverNode(view.state);
              return false;
            },
          },
        },
        view() {
          return {
            update,
            destroy,
          };
        },
      }),
    ];
  }
  destroy() {
    unmount(this.editor.$el);
  }

  updateHoverNodeAnchor(state: EditorState) {
    const element = currentStateKey.getState(state)?.hoverDom;
    if (!element) return;
    const relativePos = getRelatviePosition(this.editor.$el, element);

    hoverNodeAnchor.style.left = px(relativePos.left);
    hoverNodeAnchor.style.top = px(relativePos.top);
    hoverNodeAnchor.style.width = px(element.clientWidth);
    hoverNodeAnchor.style.height = px(element.clientHeight);
  }

  updateTextAnchor(view: EditorView) {
    const {
      state: { selection },
    } = view;
    const fromCoords = coordsAtPos(view, selection.from);
    const toCoords = coordsAtPos(view, selection.to, true);
    const relativePos = getRelativePos(fromCoords, this.editor.$el);
    textAnchor.style.left = px(relativePos.left);
    textAnchor.style.top = px(relativePos.top);
    textAnchor.style.width = px(Math.max(toCoords.left - fromCoords.left, 1));
    textAnchor.style.height = px(toCoords.bottom - fromCoords.top);
  }

  updateNodeAnchor(view: EditorView) {
    const { state } = view;
    const nodeInfo = getClosestParent(state);
    if (!nodeInfo) return;
    const dom = view.nodeDOM(nodeInfo.pos) as HTMLElement;
    const relativePos = getRelativePos(view.coordsAtPos(nodeInfo.pos), this.editor.$el);
    nodeAnchor.style.left = px(relativePos.left);
    nodeAnchor.style.top = px(relativePos.top);
    nodeAnchor.style.width = px(dom.clientWidth);
    nodeAnchor.style.height = px(dom.clientHeight);
  }

  update(view: EditorView) {
    if (!inited) {
      mount(this.editor.$el);
    }
    this.throttleUpdate(view);
  }
}

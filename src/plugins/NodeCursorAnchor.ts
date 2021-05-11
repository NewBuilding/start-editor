/* eslint-disable indent */
import { Plugin } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import { createPopper as _createPopper } from '@popperjs/core';
import { coordsAtPos, getClosestParent, setElementRect, animationShow, animationHide } from '@/utils';
import { PluginInterface } from '@/interface';
import { throttle } from 'lodash';
import { BoxRect, PluginIDEnum } from '@/@types';
import type { CreatePopperOptions } from './HoverNodeAnchor';
import type Popper from '@popperjs/core';

export interface NodeCursorAnchorOptions {
  // 在这个列表中的node，在hover时忽略，取它的父node
  textAnchorClassName: string;
  nodeAnchorClassName: string;
}

export interface PopperInstance {
  tooltip: HTMLElement;
  instance: Popper.Instance;
  show: () => void;
  hide: () => void;
}

/**
 *
 * 1、辅助实现文本菜单，创建一个text anchor element， 其位置和高度和当前光标的一致
 * 2、辅助实现块菜单，创建一个node anchor element， 其位置和大小与当前node对应的dom一致
 *
 */
export class NodeCursorAnchorPlugin extends PluginInterface<NodeCursorAnchorOptions> {
  ID = PluginIDEnum.NODE_CURSOR_ANCHOR;

  // 锚，表征光标的位置和高度
  textAnchor = document.createElement('div');

  // 锚，定位当前光标最近的父 block node
  nodeAnchor = document.createElement('div');

  popperInstances: Popper.Instance[] = [];

  anchors = [
    { ele: this.textAnchor, classname: this.options.textAnchorClassName },
    { ele: this.nodeAnchor, classname: this.options.nodeAnchorClassName },
  ];

  get defaultOptions(): NodeCursorAnchorOptions {
    return {
      textAnchorClassName: 'start-editor-text_anchor',
      nodeAnchorClassName: 'start-editor-node_anchor',
    };
  }

  get plugins(): Plugin[] {
    return [
      new Plugin({
        view: () => {
          return {
            update: this.throttleUpdate,
          };
        },
      }),
    ];
  }

  mounted() {
    this.anchors.forEach(({ ele, classname }) => {
      ele.classList.add(classname);
      ele.style.position = 'absolute';
      ele.style.zIndex = '-1';
      this.editor.shell.append(ele);
    });
  }

  destroy() {
    const shell = this.editor.shell;
    this.popperInstances.splice(0, this.popperInstances.length);
    this.anchors.forEach(({ ele }) => {
      if (shell.contains(ele)) {
        shell.removeChild(ele);
      }
    });
  }

  /**
   *  创建一个基于光标位置变化的tootip
   * @param tooltip 基于光标位置移动的tooltip
   * @param options popper配置项
   */
  createCursorPopper(tooltip: HTMLElement, options?: CreatePopperOptions) {
    return this.createPopper(this.textAnchor, tooltip, options);
  }

  /**
   * 创建一个基于当前node的tootip
   * @param tooltip
   * @param options
   */
  createNodePopper(tooltip: HTMLElement, options?: CreatePopperOptions) {
    return this.createPopper(this.nodeAnchor, tooltip, options);
  }

  private createPopper(
    anchor: HTMLElement,
    tooltip: HTMLElement,
    options?: CreatePopperOptions,
  ): PopperInstance {
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
    tooltip.style.display = 'none';
    this.editor.shell.appendChild(tooltip);
    const instance = _createPopper(anchor, tooltip, options);
    this.popperInstances.push(instance);

    return {
      instance,
      tooltip,
      show() {
        options?.doBeforeShow && options.doBeforeShow();
        animationShow(tooltip);
        instance.update();
      },
      hide() {
        options?.doBeforeHide && options.doBeforeHide();
        animationHide(tooltip);
      },
    };
  }

  private throttleUpdate = throttle(
    (view) => {
      this.updateTextAnchor(view);
      this.updateNodeAnchor(view);
    },
    200,
    { leading: false, trailing: true },
  );

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
    setElementRect(this.nodeAnchor, {
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

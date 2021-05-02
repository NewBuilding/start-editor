import { PluginInterface } from '../interface';
import type { Node as ProseMirrorNode } from 'prosemirror-model';
import {
  px,
  getRelatviePosition,
  isBoxHasTwoSideIntersaction,
  isBoxIntersection,
  getCommonParent,
  isContainerNode,
} from 'start-editor-utils';

import { NodeRangeSelection } from './NodeRangeSelection';
import { throttle } from 'lodash';
import { Position, BoxRect, Range, NodePos, PluginIDEnum } from '../type';
import type { EditorView } from 'prosemirror-view';

// 针对容器会有框选容器子项，忽略子项的容器数组
const IgnoreContainer = ['textList', 'table'];

const ROOT_ADD_CLASSNAME = 'start-editor-is_box_selecting';

/**
 * 框选功能
 * 选中条件：
 *  1. 非容器node的框选只要在框内即表示被选中
 *  2. 容器node至少两条边与框相交才被选中
 * 实现思路：区分在容器内和非容器内的框选，
 * 1. 在非容器内的框选，forEach doc的子节点，得到选中的NodeRange
 * 2. 在容器内的框选，采用广度优先搜索，先查找容器的顶级子node，
 *    如果有找到符合条件的子node，则不必遍历子node的子node，直接得到NodeRange
 *    如果在遍历顶级子node无法找到符合条件的node， 则遍历次一级的子node，
 *    直到 所有非text node都遍历完成，如果没有找到符合条件的node，说明没有node被框选中
 *
 */
export class BoxSelectNodePlugin extends PluginInterface {
  ID = PluginIDEnum.BOX_SELECT_NODE;

  get plugins() {
    return [];
  }

  // 鼠标down时候的坐标的相对文档位置
  anchor: Position = { left: 0, top: 0 };
  // 鼠标up时候的坐标的相对文档位置
  head: Position = { left: 0, top: 0 };
  showSelectBox = false;
  timeoutHandler: any = undefined;

  throttleSelectNode = throttle(this.selectNode, 100);
  selectBox!: { show: Function; hide: Function; update: Function };

  get editorContainer() {
    return this.editor.container;
  }

  get wrapConatainer() {
    return this.editor.wrap;
  }

  // 左上角的相对文档的位置
  get startPos(): Position {
    const { anchor, head } = this;
    return {
      left: Math.min(anchor.left, head.left),
      top: Math.min(anchor.top, head.top),
    };
  }

  // 右下角的相对文档的位置
  get endPos(): Position {
    const { anchor, head } = this;
    return {
      left: Math.max(anchor.left, head.left),
      top: Math.max(anchor.top, head.top),
    };
  }

  get scrollTop() {
    return this.editorContainer?.scrollTop;
  }

  mounted() {
    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
    this.onClick = this.onClick.bind(this);
    this.wrapConatainer.addEventListener('mousedown', this.onMousedown);
    this.wrapConatainer.addEventListener('contextmenu', this.onContextmenu);
    this.selectBox = this.createSelectBox(this.wrapConatainer);
  }

  destroy() {
    this.wrapConatainer.removeEventListener('mousedown', this.onMousedown);
  }

  createSelectBox(wrapConatainer: HTMLElement) {
    const ele = document.createElement('div');
    ele.classList.add('start-editor-select_box');
    wrapConatainer.appendChild(ele);
    return {
      show() {
        this.update();
        ele.style.display = 'block';
        wrapConatainer.classList.add(ROOT_ADD_CLASSNAME);
      },
      update: () => {
        const { startPos, endPos } = this;
        ele.style.left = px(startPos.left);
        ele.style.top = px(startPos.top);
        ele.style.width = px(Math.abs(endPos.left - startPos.left));
        ele.style.height = px(Math.abs(endPos.top - startPos.top));
      },
      hide() {
        ele.style.display = 'none';
        wrapConatainer.classList.remove(ROOT_ADD_CLASSNAME);
      },
    };
  }

  onContextmenu(e: Event) {
    e.preventDefault();
  }

  onMousedown(e: MouseEvent) {
    if (e.target === this.editor.shell || this.editor.shell.contains(e.target as HTMLElement)) return;
    this.timeoutHandler = setTimeout(() => {
      clearTimeout(this.timeoutHandler);
      // this.editor.tooltips?.nodeMenu.show(false);
      this.showSelectBox = true;
      this.selectBox.show();
      this.wrapConatainer.addEventListener('click', this.onClick);
    }, 200);
    this.anchor = this.getRelatviePosition({ left: e.clientX, top: e.clientY });
    const conatiner = this.wrapConatainer as HTMLElement;
    document.addEventListener('mouseup', this.onMouseup);
    conatiner.addEventListener('mousemove', this.onMousemove);
    e.preventDefault();
  }
  onMousemove(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.head = this.getRelatviePosition({ left: e.clientX, top: e.clientY });
    this.throttleSelectNode();
    this.selectBox.update();

    // 向下滚动
    if (e.clientY + 50 > window.innerHeight) {
      this.editorContainer.scrollTop += 5;
    } else if (e.clientY < 50) {
      this.editorContainer.scrollTop -= 5;
    }
  }

  onMouseup(e: MouseEvent) {
    clearTimeout(this.timeoutHandler);
    this.showSelectBox = false;
    this.selectBox.hide();
    const conatiner = this.wrapConatainer as HTMLElement;
    document.removeEventListener('mouseup', this.onMouseup);
    conatiner.removeEventListener('mousemove', this.onMousemove);
    const { selection } = this.editor.state;
    // 手动处理isEditorFocus逻辑
    if (selection instanceof NodeRangeSelection && selection.from !== selection.to) {
      this.editor.isFocus = true;
    }
  }

  getRelatviePosition(pos: Position) {
    return getRelatviePosition(this.wrapConatainer as HTMLElement, pos);
  }

  onClick(e: Event) {
    this.wrapConatainer.removeEventListener('click', this.onClick);
    // 阻止editor文件中isDocClick处理isEditorFocus逻辑，框选需要手动处理这些逻辑
    e.stopPropagation();
  }

  getNangePos(): Range {
    const {
      editor: { view, shell },
      startPos,
      endPos,
    } = this;
    const relative = getRelatviePosition(document.body, this.wrapConatainer);
    // 转换为绝对坐标
    const absoluteStartPos = { left: relative.left + startPos.left, top: startPos.top + relative.top };
    const absoluteEndPos = { left: relative.left + endPos.left, top: endPos.top + relative.top };
    const rect = shell.getBoundingClientRect();
    // // 仅在边界，box没有越过编辑器
    if (
      (absoluteStartPos.left < rect.left && absoluteEndPos.left < rect.left) ||
      (absoluteStartPos.left > rect.right && absoluteEndPos.left > rect.right)
    ) {
      return { from: 0, to: 0 };
    }
    const boxRect = {
      left: absoluteStartPos.left,
      right: absoluteEndPos.left,
      top: absoluteStartPos.top,
      bottom: absoluteEndPos.top,
    };
    const startInfo = view.posAtCoords({
      left: Math.max(rect.left, absoluteStartPos.left),
      top: Math.max(absoluteStartPos.top, rect.top),
    });
    const endInfo = view.posAtCoords({
      left: Math.min(absoluteEndPos.left, rect.right),
      top: Math.min(absoluteEndPos.top, rect.bottom),
    });
    if (!startInfo || !endInfo) return { from: 0, to: 0 };
    // select box 横向贯穿了编辑器
    if (boxRect.left <= rect.left && boxRect.right >= rect.right) {
      return { from: startInfo.pos, to: endInfo.pos };
    }

    const startResolvedPos = view.state.doc.resolve(startInfo.pos);
    const endResolvedPos = view.state.doc.resolve(endInfo.pos);

    // 是否为从左向右框选
    const isLeftToRight = absoluteStartPos.left < rect.left;
    let isInContainer = false;
    let currentNode = null;
    let currentNodePos = -1;
    if (isLeftToRight) {
      currentNode = startResolvedPos?.nodeAfter as ProseMirrorNode;
      currentNodePos = startResolvedPos.pos;
      isInContainer =
        currentNode &&
        !IgnoreContainer.includes(currentNode.type.name) &&
        isContainerNode(currentNode) &&
        getCommonParent(view.state.doc.resolve(startResolvedPos.pos + 1), endResolvedPos).node ===
          currentNode;
    } else {
      currentNode = endResolvedPos.nodeBefore as ProseMirrorNode;
      currentNodePos = endResolvedPos.pos - currentNode?.nodeSize;
      isInContainer =
        currentNode &&
        !IgnoreContainer.includes(currentNode.type.name) &&
        isContainerNode(currentNode) &&
        getCommonParent(startResolvedPos, view.state.doc.resolve(endResolvedPos.pos - 1)).node ===
          currentNode;
    }
    if (isInContainer) {
      return (
        getRangeInContainer(
          view,
          {
            node: currentNode,
            pos: currentNodePos,
          },
          boxRect,
          isLeftToRight,
        ) || {
          from: 0,
          to: 0,
        }
      );
    } else {
      return getRange(view, boxRect) || { from: 0, to: 0 };
    }
  }

  selectNode() {
    const { view, state } = this.editor;
    const range = this.getNangePos();
    if (this.showSelectBox) {
      view.dispatch(state.tr.setSelection(NodeRangeSelection.create(state.tr.doc, range.from, range.to)));
    }
  }
}

function getRangeInContainer(
  view: EditorView,
  nodePos: NodePos,
  boxRect: BoxRect,
  isLeftToRight = true,
): Range | null {
  const newNodePoses: NodePos[] = [];
  let from = -1;
  let to = -1;
  nodePos.node.forEach((node, offset) => {
    const pos = nodePos.pos + offset + 1;
    const dom = view.nodeDOM(pos) as HTMLElement;
    const rect = dom?.getBoundingClientRect();
    if (!rect) return false;
    const isIntersact = isContainerNode(node)
      ? hasIntersactWithContainer(view, { node, pos }, boxRect, from !== -1 && isLeftToRight)
      : isBoxIntersection(boxRect, rect);
    if (isIntersact) {
      if (from === -1) {
        from = pos;
        // 从右往左框选时，回溯一个，检查上一个是否有子项已经符合条件
        if (!isLeftToRight && newNodePoses.length) {
          const lastNodePos = newNodePoses[newNodePoses.length - 1];
          if (hasIntersactWithContainer(view, lastNodePos, boxRect)) from = lastNodePos.pos;
        }
      }
      to = pos + node.nodeSize;
    }
    if (isContainerNode(node)) {
      newNodePoses.push({ node, pos });
    }
  });
  if (from !== -1) return { from, to };
  for (const sonNodePos of newNodePoses) {
    const newRange = getRangeInContainer(view, sonNodePos, boxRect, isLeftToRight);
    if (newRange) {
      return newRange;
    }
  }
  return null;
}

function hasIntersactWithContainer(view: EditorView, nodePos: NodePos, boxRect: BoxRect, checkSon = true) {
  const dom = view.nodeDOM(nodePos.pos) as HTMLElement;
  const rect = dom?.getBoundingClientRect();
  if (rect && isBoxHasTwoSideIntersaction(boxRect, rect)) return true;
  if (!checkSon) return false;

  let hasIntersact = false;

  nodePos.node.descendants((node, pos) => {
    if (hasIntersact || node.isText) return false;
    pos = pos + nodePos.pos + 1;
    const dom = view.nodeDOM(pos) as HTMLElement;
    const rect = dom?.getBoundingClientRect();
    if (!rect) return false;
    hasIntersact = isContainerNode(node)
      ? isBoxHasTwoSideIntersaction(boxRect, rect)
      : isBoxIntersection(boxRect, rect);
  });
  return hasIntersact;
}

function getRange(view: EditorView, boxRect: BoxRect) {
  let from = -1;
  let to = -1;
  let isIntersact = false;
  view.state.doc.forEach((node, pos) => {
    if (isContainerNode(node)) {
      isIntersact = hasIntersactWithContainer(view, { node, pos }, boxRect, false);
    } else {
      const dom = view.nodeDOM(pos) as HTMLElement;
      const rect = dom?.getBoundingClientRect();
      isIntersact = rect && isBoxIntersection(boxRect, rect);
    }
    if (isIntersact) {
      if (from === -1) {
        from = pos;
      }
      to = pos + node.nodeSize;
    }
    return false;
  });
  if (from === -1) return null;
  return { from, to };
}

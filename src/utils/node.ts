import { EditorState, NodeSelection, Selection, TextSelection } from 'prosemirror-state';
import type { Node, ResolvedPos, Node as ProseMirrorNode } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';
import type { NodePos } from '@/@types';

export interface nodePredicate {
  (node: Node): boolean;
}

/**
 * 是否为NodeSelection
 * @param selection
 */
export function isNodeSelection(selection: Selection) {
  return selection instanceof NodeSelection;
}

/**
 * 是否为TextSelection
 * @param selection
 */
export function isTextSelection(selection: Selection) {
  return selection instanceof TextSelection;
}

export interface NodeInfo {
  pos: number;
  start: number;
  end: number;
  depth: number;
  node: ProseMirrorNode;
}

/**
 * 逐级向祖先级节点查找符合要求node
 * @param $pos
 * @param predicate
 */
export function findParentNode($pos: ResolvedPos, predicate: nodePredicate): NodeInfo | null {
  for (let i = $pos.depth; i > 0; i -= 1) {
    const node = $pos.node(i);

    if (predicate(node)) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        end: $pos.end(i),
        depth: i,
        node,
      };
    }
  }
  return null;
}

/**
 * 查找某一个节点范围
 * @param doc
 * @param targetNode
 */
export function getNodeRange(doc: EditorState | Node, targetNode: Node) {
  if (doc instanceof EditorState) {
    doc = doc.doc;
  }
  let from = 0;
  doc.descendants((node, pos, parent) => {
    if (targetNode === node) {
      from = pos;
      return false;
    }
  });
  return { from, to: from + targetNode.nodeSize };
}

/**
 * 从一个位置往上遍历，直到根元素，查找是否包含目标类型的node
 * @param pos $from类似的位置
 * @param typeName node type name 如 link
 */
export function parentHasNode(pos: ResolvedPos, typeName: string) {
  for (let i = pos.depth; i >= 0; i--) {
    if (pos.node(i).type.name === typeName) {
      return true;
    }
  }
  return false;
}

/**
 * 根据dom event查找node
 * @param view
 * @param event
 */
export function getNodeByEvent(view: EditorView, event: MouseEvent): NodePos | null {
  const pos = view.posAtCoords({
    left: event.clientX,
    top: event.clientY,
  });
  if (!pos) {
    return null;
  }
  // 为 -1，表示该坐标落在了顶级节点的位置，不在任何节点之内
  if (pos.inside == -1) {
    return null;
  }
  const $pos = view.state.doc.resolve(pos.inside);
  if (!$pos.nodeAfter) {
    return null;
  }
  return {
    node: $pos.nodeAfter,
    pos: $pos.before($pos.depth + 1),
  };
}

/**
 * 判断选区是否为目标node的一部分或全部
 * @param $from
 * @param $to
 * @param typeName
 */
export function rangeIsPartOfNode($from: ResolvedPos, $to: ResolvedPos, typeName: string): boolean {
  const parent = $from.parent;
  const toParent = $to.parent;
  return parent === toParent && parent.type.name === typeName;
}

/**
 * 是否为块级图片Element, display为block, width为100%为块级图片
 * @param element
 */
export function isBlockImage(element: HTMLElement): boolean {
  return (
    element.style.display === 'block' || [element.style.width, element.getAttribute('width')].includes('100%')
  );
}

/**
 * 获取满足条件的最近的父块节点，默认会返回 block node 或 行内image node
 * @param state
 * @param isTargetNode 目标节点判断，
 */
export function getClosestParent(
  state: EditorState,
  isTargetNode: (node: ProseMirrorNode) => boolean = (node: ProseMirrorNode) =>
    node.isBlock || ['image'].includes(node.type.name),
): NodeInfo | null {
  const { selection, doc } = state;
  if (selection instanceof NodeSelection && isTargetNode(selection.node)) {
    const { $from } = selection;
    return {
      node: selection.node,
      pos: selection.from,
      depth: $from.depth,
      start: selection.from,
      end: selection.to,
    };
  }
  const $from = isTextSelection(selection) ? selection.$from : doc.resolve(selection.from + 1);
  return findParentNode($from, (node) => isTargetNode(node));
}

/**
 * 判断是否为容器node
 * @param node
 */
export function isContainerNode(node: ProseMirrorNode): boolean {
  return node.isBlock && !node.isTextblock && !node.isAtom;
}

/**
 * 向上级查找，知道找到最近的一个公共父node
 * @param startPos
 * @param endPos
 */
export function getCommonParent(startPos: ResolvedPos, endPos: ResolvedPos): NodeInfo {
  const $pos = startPos.pos > endPos.pos ? startPos : endPos;
  const $other = startPos.pos > endPos.pos ? endPos : startPos;
  for (let i = $pos.depth; i > 0; i -= 1) {
    const node = $pos.node(i);
    const pos = i > 0 ? $pos.before(i) : 0;
    if ($other.parent === node || pos < $other.pos) {
      return {
        pos: pos,
        start: $pos.start(i),
        end: $pos.end(i),
        depth: i,
        node,
      };
    }
  }
  return {
    pos: 0,
    start: 0,
    end: startPos.doc.nodeSize,
    depth: 0,
    node: startPos.doc,
  };
}

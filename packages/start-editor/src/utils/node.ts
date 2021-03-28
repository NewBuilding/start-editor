import { Node, NodeType, ResolvedPos } from 'prosemirror-model';
import { EditorState, NodeSelection, Selection, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Dictionary, NodePos, Range } from '../types';

export interface nodePredicate {
  (node: Node): boolean;
}

export function isNodeSelection(selection: Selection) {
  return selection instanceof NodeSelection;
}

export function isTextSelection(selection: Selection) {
  return selection instanceof TextSelection;
}

export function equalNodeType(nodeType: NodeType, node: Node) {
  return Array.isArray(nodeType) && (nodeType.indexOf(node.type) > -1 || node.type === nodeType);
}

export function findSelectedNodeOfType(nodeType: NodeType) {
  return function (selection: NodeSelection) {
    if (isNodeSelection(selection)) {
      const { node, $from } = selection;

      if (equalNodeType(nodeType, node)) {
        return { node, pos: $from.pos, depth: $from.depth };
      }
    }
  };
}

export function findParentNodeClosestToPos($pos: ResolvedPos, predicate: nodePredicate) {
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
}

export function findParentNode(predicate: nodePredicate) {
  return (selection: Selection) => findParentNodeClosestToPos(selection.$from, predicate);
}

export function nodeIsActive(state: EditorState, type: NodeType, attrs: Dictionary = {}) {
  const predicate: nodePredicate = (node) => node.type === type;
  const node =
    findSelectedNodeOfType(type)(state.selection as NodeSelection) || findParentNode(predicate)(state.selection);

  if (!Object.keys(attrs).length || !node) {
    return !!node;
  }

  return node.node.hasMarkup(type, { ...node.node.attrs, ...attrs });
}

export function nodeEqualsType(types: NodeType[] | NodeType, node: Node | null | undefined) {
  if (!node) {
    return false;
  }
  return (Array.isArray(types) && types.includes(node.type)) || node.type === types;
}

/**
 * 查找某一个节点范围
 * @param doc
 * @param targetNode
 */
export function getNodeRange(doc: EditorState | Node, targetNode: Node): Range {
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

export function getNodeAndPosByEvent(view: EditorView, event: MouseEvent): NodePos | null {
  let pos = view.posAtCoords({
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

  let $pos = view.state.doc.resolve(pos.inside);

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

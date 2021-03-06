import { EditorView } from 'prosemirror-view';
import { DOMSerializer, Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { get } from 'lodash';

function textRange(node: Node, from = 0, to: number | null = null) {
  const range = document.createRange();
  range.setEnd(node, to == null ? (node as any).nodeValue.length : to);
  range.setStart(node, from || 0);
  return range;
}

function singleRect(object: Range, bias: number) {
  const rects = object.getClientRects();
  return !rects.length ? object.getBoundingClientRect() : rects[bias < 0 ? 0 : rects.length - 1];
}

/**
 * prosemirror的view.coordsAtPos在处理行末尾不正确
 * see: https://github.com/ProseMirror/prosemirror-view/pull/47
 * @param view
 * @param pos
 * @param end 是否识别末尾位置
 */
export function coordsAtPos(view: EditorView, pos: number, end = false) {
  const { node, offset } = view.domAtPos(pos) as { node: Element; offset: number };
  let side;
  let rect: any;
  if (node.nodeType === 3) {
    if (end && offset < get(node, 'nodeValue.length')) {
      rect = singleRect(textRange(node, offset - 1, offset), -1);
      side = 'right';
    } else if (offset < get(node, 'nodeValue.length')) {
      rect = singleRect(textRange(node, offset, offset + 1), -1);
      side = 'left';
    }
  } else if (node.firstChild) {
    if (offset < node.childNodes.length) {
      const child = node.childNodes[offset];
      rect = singleRect(child.nodeType === 3 ? textRange(child) : (child as any), -1);
      side = 'left';
    }
    if ((!rect || rect.top === rect.bottom) && offset) {
      const child = node.childNodes[offset - 1];
      rect = singleRect(child.nodeType === 3 ? textRange(child) : (child as any), 1);
      side = 'right';
    }
  } else {
    rect = node.getBoundingClientRect();
    side = 'left';
  }

  const x = rect[side as string];

  return {
    top: rect.top,
    bottom: rect.bottom,
    left: x,
    right: x,
  };
}

function gatherToDOM(obj: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const name in obj) {
    const toDOM = obj[name].spec.toDOM;
    if (toDOM) result[name] = toDOM;
  }
  return result;
}

function nodesFromSchema(schema: Schema) {
  const result = gatherToDOM(schema.nodes);
  if (!result.text) result.text = (node: ProseMirrorNode) => node.text;
  return result;
}

function marksFromSchema(schema: Schema) {
  return gatherToDOM(schema.marks);
}

/**
 * 将 ProseMirror Node 导出为 HTML
 */
export function serializeToHTML(schema: Schema, doc: ProseMirrorNode): string {
  const dom = new DOMSerializer(
    {
      // doc: (node) => ['div', { ...node.attrs }, 0],
      ...nodesFromSchema(schema),
    },
    marksFromSchema(schema),
  ).serializeNode(doc) as HTMLElement;

  return dom.outerHTML;
}

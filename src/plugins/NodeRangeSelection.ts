import { TextSelection, Selection, Transaction } from 'prosemirror-state';
import { Node as ProseMirrorNode, ResolvedPos, Slice } from 'prosemirror-model';
import { Mapping } from 'prosemirror-transform';

/**
 * 用以选中一个范围内的多个节点
 */
export class NodeRangeSelection extends Selection {
  constructor($anchor: ResolvedPos, $head = $anchor) {
    super($anchor, $head);
  }

  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }

  map(doc: ProseMirrorNode, mapping: Mapping): Selection {
    const $head = doc.resolve(mapping.map(this.head));
    if (!$head.parent.inlineContent) {
      return Selection.near($head);
    }
    const $anchor = doc.resolve(mapping.map(this.anchor));
    return new NodeRangeSelection($anchor.parent.inlineContent ? $anchor : $head, $head);
  }

  replace(tr: Transaction, content = Slice.empty) {
    super.replace(tr, content);
    if (content == Slice.empty) {
      const marks = this.$from.marksAcross(this.$to);
      if (marks) tr.ensureMarks(marks);
    }
  }

  eq(other: Selection) {
    return other instanceof TextSelection && other.anchor == this.anchor && other.head == this.head;
  }

  getBookmark() {
    return new NodeRangeBookmark(this.anchor, this.head);
  }

  toJSON() {
    return { type: 'nodeRange', anchor: this.anchor, head: this.head };
  }

  static fromJSON(doc: ProseMirrorNode, json: any) {
    if (typeof json.anchor != 'number' || typeof json.head != 'number')
      throw new RangeError('Invalid input for NodeRangeSelection.fromJSON');
    return new NodeRangeSelection(doc.resolve(json.anchor), doc.resolve(json.head));
  }

  static create(doc: ProseMirrorNode, anchor: number, head: number) {
    const $anchor = doc.resolve(anchor);
    return new this($anchor, doc.resolve(head));
  }
}

NodeRangeSelection.prototype.visible = false;

try {
  Selection.jsonID('NodeRangeSelection', NodeRangeSelection);
} catch (e) {}

class NodeRangeBookmark {
  constructor(public anchor: number, public head: number) {
    this.anchor = anchor;
    this.head = head;
  }
  map(mapping: Mapping) {
    return new NodeRangeBookmark(mapping.map(this.anchor), mapping.map(this.head));
  }
  resolve(doc: ProseMirrorNode) {
    return new NodeRangeSelection(doc.resolve(this.anchor), doc.resolve(this.head));
  }
}

export default NodeRangeSelection;

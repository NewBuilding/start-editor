import { Transaction, TextSelection } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { Command, Attrs, ProseMirrorNode } from '@/@types';

export function toggleInlineNode(
  type: NodeType,
  attrs: Attrs,
  onAfter: (tr: Transaction, node: ProseMirrorNode, from: number, to: number) => void = (tr, node, from) => {
    tr.setSelection(TextSelection.create(tr.doc, from + 1, from + node.nodeSize - 1));
  },
): Command {
  return (state, dispatch) => {
    const { selection, schema } = state;
    const text = state.doc.textBetween(selection.from, selection.to);
    const node = type.create(attrs, schema.text(text));
    const transaction = state.tr.replaceRangeWith(selection.from, selection.to, node);
    onAfter(transaction, node, selection.from, selection.to);
    dispatch?.(transaction);
    return true;
  };
}

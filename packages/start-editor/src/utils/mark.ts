import { ResolvedPos, MarkType, MarkSpec } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export function getMarkRange(
  $pos: ResolvedPos | null = null,
  type: MarkType | null = null,
): { from: number; to: number } | null {
  if (!$pos || !type) {
    return null;
  }

  const start = $pos.parent.childAfter($pos.parentOffset);

  if (!start.node) {
    return null;
  }

  const link = start.node.marks.find((mark) => mark.type === type);
  if (!link) {
    return null;
  }

  let startIndex = $pos.index();
  let startPos = $pos.start() + start.offset;
  let endIndex = startIndex + 1;
  let endPos = startPos + start.node.nodeSize;

  while (startIndex > 0 && link.isInSet($pos.parent.child(startIndex - 1).marks)) {
    startIndex -= 1;
    startPos -= $pos.parent.child(startIndex).nodeSize;
  }

  while (endIndex < $pos.parent.childCount && link.isInSet($pos.parent.child(endIndex).marks)) {
    endPos += $pos.parent.child(endIndex).nodeSize;
    endIndex += 1;
  }

  return { from: startPos, to: endPos };
}

export function markIsActive(state: EditorState, mark: MarkType) {
  const { from, $from, to, empty } = state.selection;

  if (empty) {
    return !!mark.isInSet(state.storedMarks || $from.marks());
  }

  return !!state.doc.rangeHasMark(from, to, mark);
}

export function getMarkAttrs(state: EditorState, type: MarkType) {
  const { from, to } = state.selection;
  let marks: MarkSpec[] = [];

  state.doc.nodesBetween(from, to, (node) => {
    marks = [...marks, ...node.marks];
  });

  const mark = marks.find((markItem) => markItem.type.name === type.name);

  if (mark) {
    return mark.attrs;
  }

  return {};
}

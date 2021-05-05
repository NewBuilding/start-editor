import type { ResolvedPos, MarkType, MarkSpec, Mark } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';

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

/**
 * 获取range 内的所有的mark
 * @param state
 * @param from
 * @param to
 * @param filter 允许过滤掉不需要的mark
 */
export function getRangeMarks(
  state: EditorState,
  from: number = state.selection.from,
  to: number = state.selection.to,
  filter: (mark: Mark) => boolean = () => true,
): Mark[] {
  let marks: Mark[] = [];
  state.doc.nodesBetween(from, to, (node) => {
    marks = [...marks, ...node.marks.filter(filter)];
  });
  return marks;
}

export type RangeStyle = Record<keyof CSSStyleDeclaration, Set<string>>;

/**
 * 获取选区内所有的样式
 * @param state
 */
export function getRangeStyle(state: EditorState): RangeStyle {
  const marks = getRangeMarks(
    state,
    state.selection.from,
    state.selection.to,
    (mark) => mark.type.name === 'style',
  );
  const style: Record<string, Set<string>> = {};
  marks.forEach((mark) => {
    Object.entries<string>(mark.attrs.style).forEach(([key, val]) => {
      if (!style[key] || !style[key].has(val)) {
        if (!style[key]) {
          style[key] = new Set();
        }
        style[key].add(val);
      }
    });
  });
  return style as RangeStyle;
}

/**
 * rangeStyle是否存在键为key值为val的style
 * @param rangeStyle
 * @param key
 * @param val
 */
export function rangeHasStyle(rangeStyle: RangeStyle, key: keyof CSSStyleDeclaration, val: string) {
  return !!rangeStyle[key] && rangeStyle[key].has(val);
}

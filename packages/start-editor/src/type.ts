import type { Node, Schema as ProseMirrorSchema } from 'prosemirror-model';
import type { Transaction, EditorState, Plugin as ProseMirrorPlugin } from 'prosemirror-state';
import type { NodeCommandsMap } from './nodes';
import type { MarkName, MarkCommandMap } from './marks';
import type { Editor } from './Editor';

export interface Dispatch {
  (tr: Transaction): void;
}

export type Schema = ProseMirrorSchema<NodeNameEnum, MarkName>;

export interface Command<S extends Schema = any> {
  (state: EditorState<S>, dispatch: Dispatch): boolean;
}

export type CommandMap = NodeCommandsMap & MarkCommandMap;

export type StyleObject = Partial<CSSStyleDeclaration>;

export interface Range {
  from: number;
  to: number;
}

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

export interface Position {
  left: number;
  top: number;
}

export type BoxRect = Omit<Rect, 'width' | 'height'>;

export type SizeRect = Omit<Rect, 'bottom' | 'right'>;

export interface NodePos {
  node: Node;
  pos: number;
}

export enum NodeNameEnum {
  AUDIO = 'audio',
  BLOCK_IMAGE = 'blockImage',
  DIVIDER = 'divider',
  HEADING = 'heading',
  IMAGE = 'image',
  LINK = 'link',
  PARAGRAPH = 'paragraph',
  SPAN = 'span',
  VIDEO = 'video',

  FLEX_BOX = 'flexBox',
  FLEX_ITEM = 'flexItem',

  LIST_ITEM = 'listItem',
  ORDERED_LIST = 'orderedList',
  TODO_ITEM = 'todoItem',
  TODO_LIST = 'todoList',
  UNORDER_LIST = 'underedList',
  HORIZONTAL_SCROLL_BOX = 'horizontalScrollBox',
  VERTICAL_SCROLL_BOX = 'verticalScrollBox',
  SCROLL_ITEM = 'scrollItem',

  TABLE = 'table',
  TABLE_CELL = 'tableCell',
  TABLE_HEADER = 'tableHeader',
  TABLE_ROW = 'tableRow',
}

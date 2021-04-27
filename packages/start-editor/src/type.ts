import type { Node, NodeSpec, Schema as ProseMirrorSchema } from 'prosemirror-model';
import type { Transaction, EditorState, Plugin } from 'prosemirror-state';
import type { NodeCommandsMap } from './nodes';
import type { MarkName, MarkCommandMap } from './marks';

interface Dispatch {
  (tr: Transaction): void;
}

type Schema = ProseMirrorSchema<NodeNameEnum, MarkName>;

interface Command<S extends Schema = any> {
  (state: EditorState<S>, dispatch: Dispatch): boolean;
}

type CommandMap = NodeCommandsMap & MarkCommandMap;

type StyleObject = Partial<CSSStyleDeclaration>;

export {
  StyleObject,
  NodeSpec,
  Node as ProseMirrorNode,
  Dispatch,
  Schema,
  Command,
  CommandMap,
  Plugin as ProseMirrorPlugin,
};

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

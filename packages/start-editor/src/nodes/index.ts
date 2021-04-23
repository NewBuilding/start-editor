import { LinkNode, LINK_NODE_NAME, LinkCommand } from './Link';
import { ImageNode, IMAGE_NODE_NAME, ImageCommand } from './Image';
import { SpanNode, SPAN_NODE_NAME, SpanCommand } from './Span';

import { ParagraphNode, PARAGRAPH_NODE_NAME, ParagraphCommand } from './Paragraph';
import { BlockImageNode, BLOCK_IMAGE_NODE_NAME, BlockImageCommand } from './BlockImage';
import { VideoNode, VIDEO_NODE_NAME, VideoCommand } from './Video';
import { AudioNode, AUDIO_NODE_NAME, AudioCommand } from './Audio';
import { HeadingNode, HEADING_NODE_NAME, HeadingCommand } from './Heading';
import { DividerNode, DIVIDER_NODE_NAME, DividerCommand } from './Divider';
import { ListItemNode, LIST_ITEM_NODE_NAME, ListItemCommand } from './list/ListItem';
import { OrderedListNode, ORDERED_LIST_NODE_NAME, OrderedListCommand } from './list/OrderedList';
import { UnorderedListNode, UNORDER_LIST_NODE_NAME, UnorderedListCommand } from './list/UnorderedList';
import { TodoItemNode, TODO_ITEM_NODE_NAME, TodoItemCommand } from './list/TodoItem';
import { TodoListNode, TODO_LIST_NODE_NAME, TodoListCommand } from './list/TodoList';
import { TableNode, TABLE_NODE_NAME, TableCommand } from './table/Table';
import { TableRowNode, TABLE_ROW_NODE_NAME, TableRowCommand } from './table/TableRow';
import { TableHeaderNode, TABLE_HEADER_NODE_NAME, TableHeaderCommand } from './table/TableHeader';
import { TableCellNode, TABLE_CELL_NODE_NAME, TableCellCommand } from './table/TableCell';
import { FlexBoxNode, FLEX_BOX_NODE_NAME, FlexBoxCommand } from './flexBox/FlexBox';
import { FlexItemNode, FLEX_ITEM_NODE_NAME, FlexItemCommand } from './flexBox/FlexItem';

export const nodeNams = [
  LINK_NODE_NAME,
  PARAGRAPH_NODE_NAME,
  IMAGE_NODE_NAME,
  BLOCK_IMAGE_NODE_NAME,
  SPAN_NODE_NAME,
  HEADING_NODE_NAME,
  DIVIDER_NODE_NAME,
  LIST_ITEM_NODE_NAME,
  UNORDER_LIST_NODE_NAME,
  ORDERED_LIST_NODE_NAME,
  TODO_ITEM_NODE_NAME,
  TODO_LIST_NODE_NAME,
  TABLE_NODE_NAME,
  TABLE_ROW_NODE_NAME,
  TABLE_HEADER_NODE_NAME,
  TABLE_CELL_NODE_NAME,
  VIDEO_NODE_NAME,
  AUDIO_NODE_NAME,
  FLEX_BOX_NODE_NAME,
  FLEX_ITEM_NODE_NAME,
] as const;

export interface NodeCommandsMap {
  [LINK_NODE_NAME]: LinkCommand;
  [PARAGRAPH_NODE_NAME]: ParagraphCommand;
  [IMAGE_NODE_NAME]: ImageCommand;
  [SPAN_NODE_NAME]: SpanCommand;
  [BLOCK_IMAGE_NODE_NAME]: BlockImageCommand;
  [HEADING_NODE_NAME]: HeadingCommand;
  [DIVIDER_NODE_NAME]: DividerCommand;
  [LIST_ITEM_NODE_NAME]: ListItemCommand;
  [UNORDER_LIST_NODE_NAME]: UnorderedListCommand;
  [ORDERED_LIST_NODE_NAME]: OrderedListCommand;
  [TODO_LIST_NODE_NAME]: TodoListCommand;
  [TODO_ITEM_NODE_NAME]: TodoItemCommand;
  [TABLE_NODE_NAME]: TableCommand;
  [TABLE_ROW_NODE_NAME]: TableRowCommand;
  [TABLE_HEADER_NODE_NAME]: TableHeaderCommand;
  [TABLE_CELL_NODE_NAME]: TableCellCommand;
  [VIDEO_NODE_NAME]: VideoCommand;
  [AUDIO_NODE_NAME]: AudioCommand;
  [FLEX_BOX_NODE_NAME]: FlexBoxCommand;
  [FLEX_ITEM_NODE_NAME]: FlexItemCommand;
}

export type NodeName = keyof NodeCommandsMap;

export type NodeCommand = NodeCommandsMap[NodeName];

export const allNodes = [
  new ParagraphNode(),
  new HeadingNode(),
  new ImageNode(),
  new BlockImageNode(),
  new LinkNode(),
  new SpanNode(),
  new DividerNode(),
  new ListItemNode(),
  new UnorderedListNode(),
  new OrderedListNode(),
  new TodoItemNode(),
  new TodoListNode(),
  new TableHeaderNode(),
  new TableCellNode(),
  new TableRowNode(),
  new TableNode(),
  new VideoNode(),
  new AudioNode(),
  new FlexBoxNode(),
  new FlexItemNode(),
];

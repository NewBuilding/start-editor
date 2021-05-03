import { NodeNameEnum } from '@/@types';

import { LinkNode, LinkCommand } from './Link';
import { ImageNode, ImageCommand } from './Image';
import { SpanNode, SpanCommand } from './Span';

import { ParagraphNode, ParagraphCommand } from './Paragraph';
import { BlockImageNode, BlockImageCommand } from './BlockImage';
import { VideoNode, VideoCommand } from './Video';
import { AudioNode, AudioCommand } from './Audio';
import { HeadingNode, HeadingCommand } from './Heading';
import { DividerNode, DividerCommand } from './Divider';
import { ListItemNode, ListItemCommand } from './list/ListItem';
import { OrderedListNode, OrderedListCommand } from './list/OrderedList';
import { UnorderedListNode, UnorderedListCommand } from './list/UnorderedList';
import { TodoItemNode, TodoItemCommand } from './list/TodoItem';
import { TodoListNode, TodoListCommand } from './list/TodoList';
import { TableNode, TableCommand } from './table/Table';
import { TableRowNode, TableRowCommand } from './table/TableRow';
import { TableHeaderNode, TableHeaderCommand } from './table/TableHeader';
import { TableCellNode, TableCellCommand } from './table/TableCell';
import { FlexBoxNode, FlexBoxCommand } from './flexBox/FlexBox';
import { FlexItemNode, FlexItemCommand } from './flexBox/FlexItem';
import { ScrollItemNode, ScrollItemCommand } from './scrollBox/ScrollItem';
import { HorizontalScrollBoxNode, HorizontalScrollBoxCommand } from './scrollBox/HorizontalScrollBox';
import { VerticalScrollBoxNode, VerticalScrollBoxCommand } from './scrollBox/VerticalScrollBox';

export interface NodeCommandsMap {
  [NodeNameEnum.LINK]: LinkCommand;
  [NodeNameEnum.PARAGRAPH]: ParagraphCommand;
  [NodeNameEnum.IMAGE]: ImageCommand;
  [NodeNameEnum.SPAN]: SpanCommand;
  [NodeNameEnum.BLOCK_IMAGE]: BlockImageCommand;
  [NodeNameEnum.HEADING]: HeadingCommand;
  [NodeNameEnum.DIVIDER]: DividerCommand;
  [NodeNameEnum.LIST_ITEM]: ListItemCommand;
  [NodeNameEnum.UNORDER_LIST]: UnorderedListCommand;
  [NodeNameEnum.ORDERED_LIST]: OrderedListCommand;
  [NodeNameEnum.TODO_LIST]: TodoListCommand;
  [NodeNameEnum.TODO_ITEM]: TodoItemCommand;
  [NodeNameEnum.TABLE]: TableCommand;
  [NodeNameEnum.TABLE_ROW]: TableRowCommand;
  [NodeNameEnum.TABLE_HEADER]: TableHeaderCommand;
  [NodeNameEnum.TABLE_CELL]: TableCellCommand;
  [NodeNameEnum.VIDEO]: VideoCommand;
  [NodeNameEnum.AUDIO]: AudioCommand;
  [NodeNameEnum.FLEX_BOX]: FlexBoxCommand;
  [NodeNameEnum.FLEX_ITEM]: FlexItemCommand;
  [NodeNameEnum.HORIZONTAL_SCROLL_BOX]: HorizontalScrollBoxCommand;
  [NodeNameEnum.VERTICAL_SCROLL_BOX]: VerticalScrollBoxCommand;
  [NodeNameEnum.SCROLL_ITEM]: ScrollItemCommand;
}

export type NodeCommand = NodeCommandsMap[NodeNameEnum];

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
  new HorizontalScrollBoxNode(),
  new VerticalScrollBoxNode(),
  new ScrollItemNode(),
  new FlexBoxNode(),
  new FlexItemNode(),
];

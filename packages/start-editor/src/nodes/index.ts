import { LinkNode, LINK_NODE_NAME, LinkCommand } from './Link';
import { ImageNode, IMAGE_NODE_NAME, ImageCommand } from './Image';
import { SpanNode, SPAN_NODE_NAME, SpanCommand } from './Span';

import { ParagraphNode, PARAGRAPH_NODE_NAME, ParagraphCommand } from './Paragraph';
import { BlockImageNode, BLOCK_IMAGE_NODE_NAME, BlockImageCommand } from './BlockImage';
import { HeadingNode, HEADING_NODE_NAME, HeadingCommand } from './Heading';
import { DividerNode, DIVIDER_NODE_NAME, DividerCommand } from './Divider';

export const nodeNams = [
  LINK_NODE_NAME,
  PARAGRAPH_NODE_NAME,
  IMAGE_NODE_NAME,
  BLOCK_IMAGE_NODE_NAME,
  SPAN_NODE_NAME,
  HEADING_NODE_NAME,
  DIVIDER_NODE_NAME,
] as const;

export interface NodeCommandsMap {
  [LINK_NODE_NAME]: LinkCommand;
  [PARAGRAPH_NODE_NAME]: ParagraphCommand;
  [IMAGE_NODE_NAME]: ImageCommand;
  [SPAN_NODE_NAME]: SpanCommand;
  [BLOCK_IMAGE_NODE_NAME]: BlockImageCommand;
  [HEADING_NODE_NAME]: HeadingCommand;
  [DIVIDER_NODE_NAME]: DividerCommand;
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
];

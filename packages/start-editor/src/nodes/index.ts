import { LinkNode, LINK_NODE_NAME, LinkCommand } from './Link';
import { ParagraphNode, PARAGRAPH_NODE_NAME, ParagraphCommand } from './Paragraph';

const nodeNams = [LINK_NODE_NAME, PARAGRAPH_NODE_NAME];

export type NodeName = typeof nodeNams[number];

export interface NodeCommands {
  [LINK_NODE_NAME]: LinkCommand;
  [PARAGRAPH_NODE_NAME]: ParagraphCommand;
}

export const allNodes = [new LinkNode(), new ParagraphNode()];

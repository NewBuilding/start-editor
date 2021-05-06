import { PluginInterface } from '../interface';
import { NodeTrailingPlugin } from './NodeTrailing';
import { NodeSelectPlugin } from './NodeSelect';
import { PlaceholderPlugin } from './Placeholder';
import { ResourcePlaceholderPlugin } from './ResourcePlaceholder';
import { BoxSelectNodePlugin } from './BoxSelectNode';
import { HoverNodeAnchorPlugin } from './HoverNodeAnchor';
import { NodeCursorAnchorPlugin } from './NodeCursorAnchor';
import { TextMenuPlugin } from './TextMenu';

export const InnerPlugins: PluginInterface[] = [
  new NodeTrailingPlugin(),
  new PlaceholderPlugin(),
  new NodeSelectPlugin(),
  new ResourcePlaceholderPlugin(),
  new BoxSelectNodePlugin(),
  new HoverNodeAnchorPlugin(),
  new NodeCursorAnchorPlugin(),
  new TextMenuPlugin(),
];

export * from './NodeTrailing';
export * from './NodeSelect';
export * from './Placeholder';
export * from './ResourcePlaceholder';
export * from './BoxSelectNode';
export * from './NodeRangeSelection';
export * from './HoverNodeAnchor';
export * from './NodeCursorAnchor';
export * from './TextMenu';

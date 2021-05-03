import { PluginInterface } from '../interface';
import { NodeTrailingPlugin } from './NodeTrailing';
import { NodeSelectPlugin } from './NodeSelect';
import { PlaceholderPlugin } from './Placeholder';
import { ResourcePlaceholderPlugin } from './ResourcePlaceholder';
import { BoxSelectNodePlugin } from './BoxSelectNode';
import { NodeRangeSelection } from './NodeRangeSelection';
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

export {
  NodeSelectPlugin,
  NodeTrailingPlugin,
  PlaceholderPlugin,
  ResourcePlaceholderPlugin,
  BoxSelectNodePlugin,
  NodeRangeSelection,
  HoverNodeAnchorPlugin,
  NodeCursorAnchorPlugin,
  TextMenuPlugin,
};

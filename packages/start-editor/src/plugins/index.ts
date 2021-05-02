import { PluginInterface } from '../interface';
import { NodeTrailingPlugin } from './NodeTrailing';
import { NodeSelectPlugin } from './NodeSelect';
import { PlaceholderPlugin } from './Placeholder';
import { ResourcePlaceholderPlugin } from './ResourcePlaceholder';
import { BoxSelectNodePlugin } from './BoxSelectNode';
import { NodeRangeSelection } from './NodeRangeSelection';
import { PopperAnchorPlugin } from './PopperAnchor';
import { HoverNodeAnchorPlugin } from './HoverNodeAnchor';
import {} from './NodeCursorAnchor';

export const InnerPlugins: PluginInterface[] = [
  new NodeTrailingPlugin(),
  new PlaceholderPlugin(),
  new NodeSelectPlugin(),
  new ResourcePlaceholderPlugin(),
  new BoxSelectNodePlugin(),
  // new PopperAnchorPlugin(),
  new HoverNodeAnchorPlugin(),
];

export {
  NodeSelectPlugin,
  NodeTrailingPlugin,
  PlaceholderPlugin,
  ResourcePlaceholderPlugin,
  BoxSelectNodePlugin,
  NodeRangeSelection,
  PopperAnchorPlugin,
  HoverNodeAnchorPlugin,
};

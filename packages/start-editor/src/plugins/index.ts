import { Editor } from '../Editor';
import { TrailingNodePlugin } from './TrailingNode';
import { SelecNodePlugin } from './SelectNode';
import { PlaceholderPlugin } from './Placeholder';

export interface PluginOptions {}

export function getPlugins(editor: Editor, options: PluginOptions) {
  return [
    new TrailingNodePlugin(editor),
    new PlaceholderPlugin(editor),
    // new SelecNodePlugin(editor)
  ];
}

import { Editor } from '../Editor';
import { TrailingNodePlugin } from './TrailingNode';

export interface PluginOptions {}

export function getPlugins(editor: Editor, options: PluginOptions) {
  return [new TrailingNodePlugin(editor)];
}

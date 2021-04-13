import { StartEditor, PluginInterface } from 'start-editor';
import { CurrentStatePlugin } from './CurrentState';
import { AnchorPopperPlugin } from './AnchorPopper';

export function getPlugins(editor: StartEditor): PluginInterface[] {
  return [new CurrentStatePlugin(editor), new AnchorPopperPlugin(editor)];
}

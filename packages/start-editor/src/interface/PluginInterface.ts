import { Plugin } from 'prosemirror-state';
import { Editor } from '../Editor';

export abstract class PluginInterface<T = Record<string, any>> {
  protected options: T;

  constructor(public editor: Editor, options: Partial<T> = {}) {
    this.options = {
      ...this.defaultOptions,
      ...options,
    };
    this.editor = editor;
  }

  get defaultOptions(): T {
    return {} as T;
  }
  abstract get plugins(): Plugin[];
}

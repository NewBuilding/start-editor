import type { Plugin } from 'prosemirror-state';
import type { StartEditor } from '../Editor';

export abstract class PluginInterface<T = Record<string, any>> {
  abstract ID: string;
  editor!: StartEditor;

  protected options: T;

  constructor(options: Partial<T> = {}) {
    this.options = {
      ...this.defaultOptions,
      ...options,
    };
  }

  get defaultOptions(): T {
    return {} as T;
  }
  abstract get plugins(): Plugin[];

  mounted() {}

  destroy() {}
}

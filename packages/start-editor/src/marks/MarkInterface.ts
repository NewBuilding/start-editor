import { MarkSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

export abstract class MarkInterface<T> {
  abstract get name(): string;
  abstract get markSpec(): MarkSpec;
  abstract commands(): T;
  abstract plugins(): Plugin[];
}

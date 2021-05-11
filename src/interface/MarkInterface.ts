import type { MarkSpec } from 'prosemirror-model';
import type { Plugin } from 'prosemirror-state';
import type { StyleObject, Schema } from '@/@types';

export abstract class MarkInterface<T> {
  abstract get name(): string;
  abstract markSpec(defaultStyle: StyleObject): MarkSpec;
  abstract plugins(): Plugin[];
  abstract commands(schema: Schema): T;
}

import { MarkSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { StyleObject } from '../type';

export abstract class MarkInterface<T> {
  abstract get name(): string;
  abstract markSpec(defaultStyle: StyleObject): MarkSpec;
  abstract plugins(): Plugin[];
  abstract commands(): T;
}

import type { NodeSpec } from 'prosemirror-model';
import type { Plugin } from 'prosemirror-state';
import type { StyleObject } from '@/@types';

export abstract class NodeInterface<T> {
  abstract get name(): string;
  abstract nodeSpec(defaultStyle?: StyleObject): NodeSpec;
  abstract plugins(): Plugin[];
  abstract commands(): T;
}

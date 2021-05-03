import { NodeSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { StyleObject } from '../type';

export abstract class NodeInterface<T> {
  abstract get name(): string;
  abstract nodeSpec(defaultStyle?: StyleObject): NodeSpec;
  abstract plugins(): Plugin[];
  abstract commands(): T;
}

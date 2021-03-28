import { NodeSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

export  abstract class NodeInterface<T> {
  
  abstract get name(): string;
  abstract get nodeSpec(): NodeSpec;
  abstract commands(): T;
  abstract plugins(): Plugin[];
}

import type { Node, NodeSpec, Schema as ProseMirrorSchema } from 'prosemirror-model';
import type { Transaction, EditorState, Plugin } from 'prosemirror-state';
import type { NodeName, NodeCommandsMap } from './nodes';
import type { MarkName, MarkCommandMap } from './marks';

interface Dispatch {
  (tr: Transaction): void;
}

type Schema = ProseMirrorSchema<NodeName, MarkName>;

interface Command<S extends Schema = any> {
  (state: EditorState<S>, dispatch: Dispatch): boolean;
}

type CommandMap = NodeCommandsMap & MarkCommandMap;

type StyleObject = Partial<CSSStyleDeclaration>;

export {
  StyleObject,
  NodeSpec,
  Node as ProseMirrorNode,
  Dispatch,
  Schema,
  Command,
  CommandMap,
  Plugin as ProseMirrorPlugin,
};

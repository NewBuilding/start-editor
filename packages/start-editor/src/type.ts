import { Node, NodeSpec, Schema as ProseMirrorSchema } from 'prosemirror-model';
import { Transaction, EditorState } from 'prosemirror-state';
import { NodeName, NodeCommands } from './nodes';
import { MarkName, MarkCommands } from './marks';

interface Dispatch {
  (tr: Transaction): void;
}

type Schema = ProseMirrorSchema<NodeName, MarkName>;

interface Command<S extends Schema = any> {
  (state: EditorState<S>, dispatch: Dispatch): boolean;
}

type Commands = NodeCommands & MarkCommands;

export { NodeSpec, Node as ProseMirrorNode, Dispatch, Schema, Command, Commands };

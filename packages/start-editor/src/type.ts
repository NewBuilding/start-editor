import { Node, NodeSpec, Schema as ProseMirrorSchema } from 'prosemirror-model';
import { Transaction, EditorState } from 'prosemirror-state';
import { NodeName, NodeCommandsMap } from './nodes';
import { MarkName, MarkCommandMap } from './marks';

interface Dispatch {
  (tr: Transaction): void;
}

type Schema = ProseMirrorSchema<NodeName, MarkName>;

interface Command<S extends Schema = any> {
  (state: EditorState<S>, dispatch: Dispatch): boolean;
}

type CommandMap = NodeCommandsMap & MarkCommandMap;

export type StyleObject = Partial<CSSStyleDeclaration>;

export { NodeSpec, Node as ProseMirrorNode, Dispatch, Schema, Command, CommandMap };

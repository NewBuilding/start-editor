import type { Node as ProseMirrorNode } from 'prosemirror-model';

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface NodePos {
  node: ProseMirrorNode;
  pos: number;
}

export interface Position {
  left: number;
  top: number;
}

import { StyleMark, STYLE_MARK_NAME, StyleCommand } from './Style';

const markNames = [STYLE_MARK_NAME];

export type MarkName = typeof markNames[number];

export interface MarkCommands {
  [STYLE_MARK_NAME]: StyleCommand;
}

export const allMarks = [new StyleMark()];

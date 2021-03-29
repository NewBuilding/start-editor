import { StyleMark, STYLE_MARK_NAME, StyleCommand } from './Style';

export const markNames = [STYLE_MARK_NAME] as const;

export interface MarkCommandMap {
  [STYLE_MARK_NAME]: StyleCommand;
}

export type MarkName = keyof MarkCommandMap;

export type MarkCommand = MarkCommandMap[MarkName];

export const allMarks = [new StyleMark()];

import { MarkNameEnum } from '@/@types';
import { StyleMark, StyleCommand } from './Style';

export interface MarkCommandMap {
  [MarkNameEnum.STYLE]: StyleCommand;
}

export type MarkCommand = MarkCommandMap[MarkNameEnum];

export const allMarks = [new StyleMark()];

import { Action } from '../action.enum';

export interface Player {
  name: string;
  rowIndex: number;
  colIndex: number;

  survived: boolean;

  action1: Action;
  action2: Action;
  action3: Action;
}

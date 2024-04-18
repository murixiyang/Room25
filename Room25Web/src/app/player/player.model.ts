import { Action } from '../action.enum';
import { Position } from '../types/position.model';

export interface Player {
  name: string;
  playerPos: Position;

  survived: boolean;

  action1: Action;
  action2: Action;
  action3: Action;
}

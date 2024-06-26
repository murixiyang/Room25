import { Action } from '../action.enum';
import { Position } from '../types/position.model';

export interface Player {
  name: string;
  playerPos: Position;

  survived: boolean;

  actions: Action[];
}

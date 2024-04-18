import { Injectable } from '@angular/core';
import { Action } from '../action.enum';
import { Player } from './player.model';
import { Position } from '../types/position.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor() {}

  // Perform user side action
  performAction(
    player: Player,
    selectedAction: Action,
    selectedRowIndex: number,
    selectedColIndex: number
  ) {
    switch (selectedAction) {
      case Action.MOVE:
        this.updatePosition(player, selectedRowIndex, selectedColIndex);
        break;

      case Action.PEEK:
        console.log('This room is GREEN!');
        break;
      case Action.PUSH:
        break;
      case Action.DRAG:
        break;
      case Action.SPECIAL:
        break;
      default:
        break;
    }
  }

  updatePosition(player: Player, rowIndex: number, colIndex: number): void;
  updatePosition(player: Player, position: [number, number]): void;

  updatePosition(player: Player, arg2: any, arg3?: any): void {
    if (arg3 !== undefined) {
      player.playerPos.rowIndex = arg2;
      player.playerPos.colIndex = arg3;
    } else {
      player.playerPos.rowIndex = arg2[0];
      player.playerPos.colIndex = arg2[1];
    }
  }
}

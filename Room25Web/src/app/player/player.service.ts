import { Injectable } from '@angular/core';
import { Action } from '../action.enum';
import { Player } from './player.model';

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
      player.rowIndex = arg2;
      player.colIndex = arg3;
    } else {
      player.rowIndex = arg2[0];
      player.colIndex = arg2[1];
    }
  }

  // Get player action
  getRowIndex(player: Player): number {
    return player.rowIndex;
  }

  getColIndex(player: Player): number {
    return player.colIndex;
  }

  getPosition(player: Player): [number, number] {
    return [player.rowIndex, player.colIndex];
  }
}

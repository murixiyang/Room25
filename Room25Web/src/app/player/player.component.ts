import { Component, Input } from '@angular/core';
import { Action } from '../action.enum';
import { RoomComponent } from '../room/room.component';
import { Player } from './player.model';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [RoomComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent {
  @Input() player!: Player;

  constructor() {}

  // Overload updatePosition
  updatePosition(rowIndex: number, colIndex: number): void;
  updatePosition(position: [number, number]): void;

  updatePosition(arg1: any, arg2?: any): void {
    if (arg2 !== undefined) {
      this.player.rowIndex = arg1;
      this.player.colIndex = arg2;
    } else {
      this.player.rowIndex = arg1[0];
      this.player.colIndex = arg1[1];
    }
  }

  // Get player action
  getRowIndex(): number {
    return this.player.rowIndex;
  }

  getColIndex(): number {
    return this.player.colIndex;
  }

  getPosition(): [number, number] {
    return [this.player.rowIndex, this.player.colIndex];
  }
}

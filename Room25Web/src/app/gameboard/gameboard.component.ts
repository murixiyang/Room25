import { Component } from '@angular/core';
import { RoomComponent } from '../room/room.component';

import { NgFor, NgIf } from '@angular/common';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-gameboard',
  standalone: true,
  imports: [RoomComponent, PlayerComponent, NgFor, NgIf],
  templateUrl: './gameboard.component.html',
  styleUrl: './gameboard.component.css',
})
export class GameboardComponent {
  rows: number[] = [0, 1, 2, 3, 4];
  cols: number[] = [0, 1, 2, 3, 4];
  player = new PlayerComponent();

  movePlayer(direction: string): void {
    switch (direction) {
      case 'up':
        if (this.player.colIndex > 0) {
          this.player.colIndex--;
        }
        break;
      case 'down':
        if (this.player.colIndex < this.rows.length - 1) {
          this.player.colIndex++;
        }
        break;
      case 'left':
        if (this.player.rowIndex > 0) {
          this.player.rowIndex--;
        }
        break;
      case 'right':
        if (this.player.rowIndex < this.cols.length - 1) {
          this.player.rowIndex++;
        }
        break;
    }
  }
}

import { Component } from '@angular/core';
import { RoomComponent } from '../room/room.component';
import { NgFor, NgIf } from '@angular/common';

import { PlayerComponent } from '../player/player.component';
import { DangerousLevel } from '../dangerous-level.enum';
import { shuffle } from '../utils';

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

  redNum = 8;
  yellowNum = 10;
  greenNum = 4;
  blueNum = 2;

  roomDistribution: DangerousLevel[] = [
    ...Array(25).fill(DangerousLevel.GREEN),
  ];

  constructor() {
    this.generateInitialBoard();
  }

  generateInitialBoard(): void {
    // put center
    this.roomDistribution[12] = DangerousLevel.BLUE;

    // Shuffle and select indices for red, yellow, and green rooms
    const nearIndices = [2, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 22];
    const otherIndices = [0, 1, 3, 4, 5, 9, 15, 19, 20, 21, 23, 24];

    const firstSelection = [
      ...Array(this.redNum).fill(DangerousLevel.RED),
      ...Array(this.yellowNum).fill(DangerousLevel.YELLOW),
      ...Array(this.greenNum).fill(DangerousLevel.GREEN),
    ];
    shuffle(firstSelection);

    // Assign red, yellow, and green rooms to selected indices
    for (let i = 0; i < nearIndices.length; i++) {
      this.roomDistribution[nearIndices[i]] = firstSelection[i];
    }

    // Calculate placed red, yellow, green
    const placedRed = firstSelection
      .slice(0, nearIndices.length)
      .filter((color) => color === DangerousLevel.RED).length;
    const placedYellow = firstSelection
      .slice(0, nearIndices.length)
      .filter((color) => color === DangerousLevel.YELLOW).length;
    const placedGreen = firstSelection
      .slice(0, nearIndices.length)
      .filter((color) => color === DangerousLevel.GREEN).length;

    // Calculate left red, yellow, green
    const remainingRed = this.redNum - placedRed;
    const remainingYellow = this.yellowNum - placedYellow;
    const remainingGreen = this.greenNum - placedGreen;

    // Shuffle the rest
    const secondSelection = [
      ...Array(remainingRed).fill(DangerousLevel.RED),
      ...Array(remainingYellow).fill(DangerousLevel.YELLOW),
      ...Array(remainingGreen).fill(DangerousLevel.GREEN),
      ...Array(this.blueNum).fill(DangerousLevel.BLUE),
    ];
    shuffle(secondSelection);

    // Assign red, yellow, and green rooms to selected indices
    for (let i = 0; i < otherIndices.length; i++) {
      this.roomDistribution[otherIndices[i]] = secondSelection[i];
    }
  }

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

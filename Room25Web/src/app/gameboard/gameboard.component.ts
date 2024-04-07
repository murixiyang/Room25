import { Component } from '@angular/core';
import { RoomComponent } from '../room/room.component';

import { NgFor } from '@angular/common';

@Component({
  selector: 'app-gameboard',
  standalone: true,
  imports: [RoomComponent, NgFor],
  templateUrl: './gameboard.component.html',
  styleUrl: './gameboard.component.css',
})
export class GameboardComponent {
  rows: number[] = [0, 1, 2, 3, 4];
  cols: number[] = [0, 1, 2, 3, 4];
}

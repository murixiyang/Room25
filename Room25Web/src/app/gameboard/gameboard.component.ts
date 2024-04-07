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
}

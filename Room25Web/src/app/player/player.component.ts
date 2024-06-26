import { Component, Input } from '@angular/core';
import { RoomComponent } from '../room/room.component';
import { Player } from './player.model';
import { Action } from '../action.enum';

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

  assignAction(event: Action[]) {
    this.player.actions[0] = event[0];
    this.player.actions[1] = event[1];
  }
}

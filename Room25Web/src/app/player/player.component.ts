import { Component, Input } from '@angular/core';
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
}

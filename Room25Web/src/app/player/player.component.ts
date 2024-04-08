import { Component, Input } from '@angular/core';
import { Action } from '../action.enum';
import { RoomComponent } from '../room/room.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [RoomComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent {
  @Input() name: string = 'Frank';
  @Input() rowIndex: number = 2;
  @Input() colIndex: number = 2;
  @Input() survived: boolean = true;

  @Input() action1!: Action;
  @Input() action2!: Action;
  @Input() action3!: Action;

  constructor() {}

  // Move action
  movePlayer(direction: string): void {
    switch (direction) {
      case 'up':
        if (this.colIndex > 0) {
          this.colIndex--;
        }
        break;
      case 'down':
        if (this.colIndex < 4) {
          this.colIndex++;
        }
        break;
      case 'left':
        if (this.rowIndex > 0) {
          this.rowIndex--;
        }
        break;
      case 'right':
        if (this.rowIndex < 4) {
          this.rowIndex++;
        }
        break;
    }
  }
}

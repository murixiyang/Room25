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
  private rowIndex: number = 2;
  private colIndex: number = 2;
  @Input() survived: boolean = true;

  @Input() action1!: Action;
  @Input() action2!: Action;
  @Input() action3!: Action;

  constructor() {}

  performAction(
    selectedAction: Action,
    selectedRowIndex: number,
    selectedColIndex: number
  ) {
    switch (selectedAction) {
      case Action.MOVE:
        this.rowIndex = selectedRowIndex;
        this.colIndex = selectedColIndex;
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

  updatePosition(rowIndex: number, colIndex: number) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
  }

  getRowIndex(): number {
    return this.rowIndex;
  }

  getColIndex(): number {
    return this.colIndex;
  }

  getPosition(): [number, number] {
    return [this.rowIndex, this.colIndex];
  }
}

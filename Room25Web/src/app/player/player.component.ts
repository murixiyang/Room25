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

  // Perform user side action
  performAction(
    selectedAction: Action,
    selectedRowIndex: number,
    selectedColIndex: number
  ) {
    switch (selectedAction) {
      case Action.MOVE:
        this.updatePosition(selectedRowIndex, selectedColIndex);
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

  // Overload updatePosition
  updatePosition(rowIndex: number, colIndex: number): void;
  updatePosition(position: [number, number]): void;

  updatePosition(arg1: any, arg2?: any): void {
    if (arg2 !== undefined) {
      this.rowIndex = arg1;
      this.colIndex = arg2;
    } else {
      this.rowIndex = arg1[0];
      this.colIndex = arg1[1];
    }
  }

  // Get player action
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

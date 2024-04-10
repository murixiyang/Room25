import {
  Component,
  Input,
  Renderer2,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

import { NgClass } from '@angular/common';

import { DangerousLevel } from '../dangerous-level.enum';
import { Action } from '../action.enum';
import { LockStatus } from '../lock-status.enum';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [NgClass],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent {
  @Input() dangerousLevel: DangerousLevel = DangerousLevel.GREEN;
  @Input() lockStatus: LockStatus = LockStatus.AVAILABLE;
  @Input() id: number = 0;
  @Input() rowIndex: number = 0;
  @Input() colIndex: number = 0;

  // Room status
  @Input() selectable: boolean = false;
  @Input() revealed: boolean = false;

  @Output() triggerRoomClicked: EventEmitter<{
    rowIndex: number;
    colIndex: number;
  }> = new EventEmitter();

  // ENUM
  Action = Action;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  performAction() {
    console.log(
      `Room action performed for room at (${this.rowIndex}, ${this.colIndex})`
    );
  }

  // Update the opacity based on the transparent state
  setTransparent(isTransparent: boolean): void {
    const roomElement = this.elRef.nativeElement;
    console.log(roomElement);
    const opacity = isTransparent ? '0.2' : '1';
    this.renderer.setStyle(roomElement, 'opacity', opacity);
  }

  // Emit the click event with the room position
  handleRoomClicked(): void {
    this.triggerRoomClicked.emit({
      rowIndex: this.rowIndex,
      colIndex: this.colIndex,
    });
  }

  // Overload updatePosition
  updatePosition(rowIndex: number, colIndex: number): void;
  updatePosition(position: [number, number]): void;

  updatePosition(arg1: any, arg2?: number): void {
    if (arg2 !== undefined) {
      this.rowIndex = arg1;
      this.colIndex = arg2;
    } else {
      this.rowIndex = arg1[0];
      this.colIndex = arg1[1];
    }
  }

  // Get room position
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

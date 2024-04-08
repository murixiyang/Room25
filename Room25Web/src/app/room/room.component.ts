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
  @Input() rowIndex: number = 0;
  @Input() colIndex: number = 0;

  // Room status
  @Input() selectable: boolean = false;
  @Input() revealed: boolean = false;

  @Output() roomClicked: EventEmitter<{
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

  setTransparent(isTransparent: boolean): void {
    // Update the opacity based on the transparent state

    const roomElement = this.elRef.nativeElement;
    const opacity = isTransparent ? '0.2' : '1';
    this.renderer.setStyle(roomElement, 'opacity', opacity);
  }

  handleRoomClicked(): void {
    // Emit the click event with the action and room position
    this.roomClicked.emit({
      rowIndex: this.rowIndex,
      colIndex: this.colIndex,
    });
  }
}

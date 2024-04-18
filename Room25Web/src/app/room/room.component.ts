import {
  Component,
  Input,
  Renderer2,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

import { NgClass } from '@angular/common';

import { Action } from '../action.enum';
import { Room } from './room.model';
import { Position } from '../types/position.model';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [NgClass],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent {
  @Input() room!: Room;

  @Output() triggerRoomClicked: EventEmitter<Position> = new EventEmitter();

  // ENUM
  Action = Action;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  performAction() {
    console.log(
      `Room action performed for room at (${this.room.rowIndex}, ${this.room.colIndex})`
    );
  }

  // Update the opacity based on the transparent state
  setTransparent(isTransparent: boolean): void {
    const roomElement = this.elRef.nativeElement;
    const opacity = isTransparent ? '0.2' : '1';
    this.renderer.setStyle(roomElement, 'opacity', opacity);
  }

  // Update the selectable by view
  setSelectable(selectable: boolean): void {
    this.room.selectable = selectable;
  }

  getAbsRoomPos(): { topPos: number; leftPos: number } {
    const roomElement = this.elRef.nativeElement;
    const rect = roomElement.getBoundingClientRect();
    return { topPos: rect.top, leftPos: rect.left };
  }

  getRoomWidth(): number {
    const roomElement = this.elRef.nativeElement;
    const rect = roomElement.getBoundingClientRect();
    return rect.width;
  }

  // Emit the click event with the room position
  handleRoomClicked(): void {
    this.triggerRoomClicked.emit({
      rowIndex: this.room.rowIndex,
      colIndex: this.room.colIndex,
    });
  }
}

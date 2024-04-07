import { Component, Input } from '@angular/core';

import { NgClass } from '@angular/common';

import { DangerousLevel } from '../dangerous-level.enum';
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

  performAction() {
    console.log(
      `Room action performed for room at (${this.rowIndex}, ${this.colIndex})`
    );
  }
}

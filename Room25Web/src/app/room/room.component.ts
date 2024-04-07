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
  @Input() xIndex: number = 0;
  @Input() yIndex: number = 0;
  @Input() lockStatus: LockStatus = LockStatus.AVAILABLE;

  performAction() {
    console.log(
      `Room action performed for room at (${this.xIndex}, ${this.yIndex})`
    );
  }
}

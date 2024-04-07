import { Component, Input } from '@angular/core';

// Define enums
enum DangerousLevel {
  GREEN = 'Grenn',
  YELLOW = 'Yellow',
  Red = 'Red',
}

enum LockStatus {
  Available = 'Available',
  Locked = 'Locked',
  Destroyed = 'Destroyed',
}

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent {
  dangerousLevel: DangerousLevel;
  xIndex: number;
  yIndex: number;
  lockStatus: LockStatus;

  constructor(
    dangerousLevel: DangerousLevel,
    xIndex: number,
    yIndex: number,
    lockStatus: LockStatus
  ) {
    this.dangerousLevel = dangerousLevel;
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.lockStatus = lockStatus;
  }

  // Placeholder function for room action
  performAction() {
    console.log(
      `Room action performed for room at (${this.xIndex}, ${this.yIndex})`
    );
  }
}

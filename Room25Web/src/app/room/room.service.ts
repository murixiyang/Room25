import { Injectable } from '@angular/core';
import { Room } from './room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor() {}

  // Overload updatePosition
  updatePosition(room: Room, rowIndex: number, colIndex: number): void;
  updatePosition(room: Room, position: [number, number]): void;

  updatePosition(room: Room, arg2: any, arg3?: number): void {
    if (arg3 !== undefined) {
      room.rowIndex = arg2;
      room.colIndex = arg3;
    } else {
      room.rowIndex = arg2[0];
      room.colIndex = arg2[1];
    }
  }

  // Get room position
  getRowIndex(room: Room): number {
    return room.rowIndex;
  }

  getColIndex(room: Room): number {
    return room.colIndex;
  }

  getPosition(room: Room): [number, number] {
    return [room.rowIndex, room.colIndex];
  }

  revealRoom(room: Room): void {
    room.revealed = true;
  }
}

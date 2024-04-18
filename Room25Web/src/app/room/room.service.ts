import { Injectable } from '@angular/core';
import { Room } from './room.model';
import { Position } from '../types/position.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor() {}

  // Overload updatePosition
  updatePosition(room: Room, rowIndex: number, colIndex: number): void;
  updatePosition(room: Room, position: Position): void;

  updatePosition(room: Room, arg2: any, arg3?: number): void {
    if (arg3 !== undefined) {
      room.roomPos.rowIndex = arg2;
      room.roomPos.colIndex = arg3;
    } else {
      room.roomPos = arg2;
    }
  }

  revealRoom(room: Room): void {
    room.revealed = true;
  }
}

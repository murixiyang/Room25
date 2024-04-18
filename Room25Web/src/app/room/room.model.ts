import { DangerousLevel } from '../dangerous-level.enum';
import { LockStatus } from '../lock-status.enum';
import { Position } from '../types/position.model';

export interface Room {
  roomPos: Position;
  dangerousLevel: DangerousLevel;
  lockStatus: LockStatus;
  id: number;
  revealed: boolean;
  selectable: boolean;
}

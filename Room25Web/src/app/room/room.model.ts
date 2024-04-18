import { DangerousLevel } from '../dangerous-level.enum';
import { LockStatus } from '../lock-status.enum';

export interface Room {
  rowIndex: number;
  colIndex: number;
  dangerousLevel: DangerousLevel;
  lockStatus: LockStatus;
  id: number;
  revealed: boolean;
  selectable: boolean;
}

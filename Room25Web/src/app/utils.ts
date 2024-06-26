import { Position } from './types/position.model';

export function shuffle<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default function fromIndexToViewID(
  rowIndex: number,
  colIndex: number
): number {
  return rowIndex * 5 + colIndex;
}

export function fromViewIDToIndex(id: number): [number, number] {
  return [Math.floor(id / 5), id % 5];
}

export function toPosition(rowIndex: number, colIndex: number): Position {
  return { rowIndex: rowIndex, colIndex: colIndex };
}

export function samePosition(
  position1: Position,
  position2: Position
): boolean {
  return (
    position1.rowIndex === position2.rowIndex &&
    position1.colIndex === position2.colIndex
  );
}

export function rotateToNegative(input: number) {
  const newIndex = (input - 1) % 5;
  return newIndex < 0 ? newIndex + 5 : newIndex;
}

export function rotateToPositive(input: number) {
  return (input + 1) % 5;
}

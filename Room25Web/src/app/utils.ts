export function shuffle<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function fromIndexToID(rowIndex: number, colIndex: number): number {
  return colIndex * 5 + rowIndex;
}

export function fromIDToIndex(id: number): [number, number] {
  return [Math.floor(id / 5), id % 5];
}

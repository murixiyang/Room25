import {
  Component,
  QueryList,
  ViewChildren,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

import { RoomComponent } from '../room/room.component';
import { PlayerComponent } from '../player/player.component';

import { DangerousLevel } from '../dangerous-level.enum';
import { Action } from '../action.enum';
import { fromIDToIndex, fromIndexToID, shuffle } from '../utils';

@Component({
  selector: 'app-gameboard',
  standalone: true,
  imports: [RoomComponent, PlayerComponent, NgFor, NgIf, NgClass],
  templateUrl: './gameboard.component.html',
  styleUrl: './gameboard.component.css',
})
export class GameboardComponent {
  @ViewChildren(RoomComponent) roomComponents!: QueryList<RoomComponent>;

  rows: number[] = [0, 1, 2, 3, 4];
  cols: number[] = [0, 1, 2, 3, 4];
  player = new PlayerComponent();

  // Game status
  selectingRoom = false;

  // Enum
  Action = Action;

  // Game setup
  redNum = 8;
  yellowNum = 10;
  greenNum = 4;
  blueNum = 2;

  roomDistribution: RoomComponent[][] = [];

  roomRevealed: boolean[] = [...Array(25).fill(true)];

  constructor(private renderer: Renderer2, private elRef: ElementRef) {
    // Randomly place rooms
    this.generateInitialBoard();

    // Reveal center
    this.roomRevealed[12] = true;
  }

  generateInitialBoard(): void {
    // Create RoomComponent instances and put them in roomDistribution
    for (let col = 0; col < 5; col++) {
      this.roomDistribution[col] = [];
      for (let row = 0; row < 5; row++) {
        const room = new RoomComponent(this.renderer, this.elRef);
        room.rowIndex = row;
        room.colIndex = col;

        const id = fromIndexToID(row, col);
        room.id = id;
        room.revealed = this.roomRevealed[id];
        this.roomDistribution[col][row] = room;

        console.log('generated at ' + row + ', ' + col, ' id:' + id);
      }
    }

    // put center
    this.roomDistribution[2][2].dangerousLevel = DangerousLevel.BLUE;

    // Shuffle and select indices for red, yellow, and green rooms
    const nearIndices = [2, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 22];
    const otherIndices = [0, 1, 3, 4, 5, 9, 15, 19, 20, 21, 23, 24];

    const firstSelection = [
      ...Array(this.redNum).fill(DangerousLevel.RED),
      ...Array(this.yellowNum).fill(DangerousLevel.YELLOW),
      ...Array(this.greenNum).fill(DangerousLevel.GREEN),
    ];
    shuffle(firstSelection);

    // Assign red, yellow, and green rooms to selected indices
    for (let i = 0; i < nearIndices.length; i++) {
      const [rowIndex, colIndex] = fromIDToIndex(nearIndices[i]);
      this.roomDistribution[colIndex][rowIndex].dangerousLevel =
        firstSelection[i];
    }

    // Calculate placed red, yellow, green
    const placedRed = firstSelection
      .slice(0, nearIndices.length)
      .filter((color) => color === DangerousLevel.RED).length;
    const placedYellow = firstSelection
      .slice(0, nearIndices.length)
      .filter((color) => color === DangerousLevel.YELLOW).length;
    const placedGreen = firstSelection
      .slice(0, nearIndices.length)
      .filter((color) => color === DangerousLevel.GREEN).length;

    // Calculate left red, yellow, green
    const remainingRed = this.redNum - placedRed;
    const remainingYellow = this.yellowNum - placedYellow;
    const remainingGreen = this.greenNum - placedGreen;

    // Shuffle the rest
    const secondSelection = [
      ...Array(remainingRed).fill(DangerousLevel.RED),
      ...Array(remainingYellow).fill(DangerousLevel.YELLOW),
      ...Array(remainingGreen).fill(DangerousLevel.GREEN),
      ...Array(this.blueNum).fill(DangerousLevel.BLUE),
    ];
    shuffle(secondSelection);

    // Assign red, yellow, and green rooms to selected indices
    for (let i = 0; i < otherIndices.length; i++) {
      const [rowIndex, colIndex] = fromIDToIndex(otherIndices[i]);
      this.roomDistribution[colIndex][rowIndex].dangerousLevel =
        secondSelection[i];
    }
  }

  // For MOVE and PEEK
  showAvailableRoomsForAction() {
    // Make all rooms transparent
    this.roomComponents.forEach((room) => {
      room.setTransparent(true);
    });

    // Make neighbour room
    this.getNeighbourRooms().forEach((room) => {
      room.setTransparent(false);
      room.selectable = true;
    });

    this.selectingRoom = true;
  }

  showDefulatRoomTransparency() {
    // Make all rooms transparent
    this.roomComponents.forEach((room) => {
      room.setTransparent(false);
    });
  }

  // For DRAG
  showAvailableDirection() {}

  private getNeighbourRooms(): RoomComponent[] {
    // Filter room components to find neighbor rooms
    return this.roomComponents.filter((room) => {
      return (
        (room.rowIndex === this.player.rowIndex - 1 &&
          room.colIndex === this.player.colIndex) || // Room above
        (room.rowIndex === this.player.rowIndex + 1 &&
          room.colIndex === this.player.colIndex) || // Room below
        (room.rowIndex === this.player.rowIndex &&
          room.colIndex === this.player.colIndex - 1) || // Room to the left
        (room.rowIndex === this.player.rowIndex &&
          room.colIndex === this.player.colIndex + 1) // Room to the right
      );
    });
  }

  private isNeighbourRoom(selectedRoom: RoomComponent | undefined): boolean {
    return (
      selectedRoom !== undefined &&
      this.getNeighbourRooms().includes(selectedRoom)
    );
  }

  // For MOVE, PEEK
  handleRoomClicked(event: { rowIndex: number; colIndex: number }): void {
    const selectedRowIndex = event.rowIndex;
    const selectedColIndex = event.colIndex;
    const selectedAction = Action.DRAG;

    const selectedRoom = this.roomComponents.find((room) => {
      return (
        room.rowIndex === selectedRowIndex && room.colIndex === selectedColIndex
      );
    });

    // Construct the message based on the action and room position
    const message = `Player performed ${selectedAction} in room (${selectedColIndex} - ${selectedRowIndex})`;

    // Display the message
    if (this.selectingRoom && this.isNeighbourRoom(selectedRoom)) {
      console.log(message);
      // Perform player action
      this.player.performAction(
        selectedAction,
        selectedRowIndex,
        selectedColIndex
      );

      // If move/push into an unrevealed room, reveal it
      // if (
      //   !this.roomRevealed[fromIndexToID(selectedRowIndex, selectedColIndex)] &&
      //   (selectedAction === Action.MOVE || selectedAction === Action.PUSH)
      // ) {
      //   this.roomRevealed[fromIndexToID(selectedRowIndex, selectedColIndex)] =
      //     true;
      // }

      // Perform room action
      this.handleDrag('left');

      // Recover Room
      this.showDefulatRoomTransparency();
    }
  }

  handleDrag(direction: 'left' | 'right' | 'up' | 'down') {
    const selectedDirection = direction;
    switch (selectedDirection) {
      case 'left':
      case 'right':
        this.dragRow(this.player.rowIndex, selectedDirection);
        break;
      case 'up':
      case 'down':
    }
  }

  dragRow(rowIndex: number, direction: 'left' | 'right'): void {
    const rowSize = 5;

    // Calculate the new indices for the rooms in the row
    const newRoomIndices = Array(rowSize)
      .fill(0)
      .map((_, i) => {
        let newIndex = i;
        if (direction === 'left') {
          newIndex = i === 0 ? rowSize - 1 : i - 1; // Wrap around if at the beginning
        } else {
          newIndex = i === rowSize - 1 ? 0 : i + 1; // Wrap around if at the end
        }
        return fromIndexToID(rowIndex, newIndex);
      });

    // Update the room distribution based on the new indices
    const newRoomDistribution = this.roomDistribution.slice(); // Copy the array to avoid mutation
    for (let i = 0; i < rowSize; i++) {
      newRoomDistribution[newRoomIndices[i]] =
        this.roomDistribution[fromIndexToID(rowIndex, i)];
    }

    // Update the room distribution
    this.roomDistribution = newRoomDistribution;
  }

  localFromIndexToID(rowIndex: number, colIndex: number): number {
    return fromIndexToID(rowIndex, colIndex);
  }
}

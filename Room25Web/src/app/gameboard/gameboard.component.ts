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
import { rotateToNegative } from '../utils';
import {
  fromIDToIndex,
  fromIndexToID,
  samePosition,
  shuffle,
  rotateToPositive,
} from '../utils';

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
    for (let row = 0; row < 5; row++) {
      this.roomDistribution[row] = [];
      for (let col = 0; col < 5; col++) {
        const room = new RoomComponent(this.renderer, this.elRef);
        room.updatePosition(row, col);

        const id = fromIndexToID(row, col);
        room.id = id;
        room.revealed = this.roomRevealed[id];
        this.roomDistribution[row][col] = room;
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
      this.roomDistribution[rowIndex][colIndex].dangerousLevel =
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
      this.roomDistribution[rowIndex][colIndex].dangerousLevel =
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
      room.selectable = false;
    });
  }

  // For DRAG
  showAvailableDirection() {}

  private getNeighbourRooms(): RoomComponent[] {
    // Filter room components to find neighbor rooms
    return this.roomComponents.filter((room) => {
      const [roomRowIndex, roomColIndex] = room.getPosition();
      const [playerRowIndex, playerColIndex] = this.player.getPosition();
      return (
        (roomRowIndex === playerRowIndex - 1 &&
          roomColIndex === playerColIndex) || // Room above
        (roomRowIndex === playerRowIndex + 1 &&
          roomColIndex === playerColIndex) || // Room below
        (roomRowIndex === playerRowIndex &&
          roomColIndex === playerColIndex - 1) || // Room to the left
        (roomRowIndex === playerRowIndex && roomColIndex === playerColIndex + 1) // Room to the right
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
        room.getPosition()[0] === selectedRowIndex &&
        room.getPosition()[1] === selectedColIndex
      );
    });

    // If not selectable, dont do anything
    if (!selectedRoom?.selectable) {
      return;
    }

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
        this.dragRow(this.player.getPosition()[0], selectedDirection);
        break;
      case 'up':
      case 'down':
    }
  }

  dragRow(selectedRowIndex: number, direction: 'left' | 'right'): void {
    const newRoomDistribution: RoomComponent[][] = [];
    // Make deep copy
    for (let row = 0; row < 5; row++) {
      newRoomDistribution[row] = [];
      for (let col = 0; col < 5; col++) {
        newRoomDistribution[row][col] = this.roomDistribution[row][col];
      }
    }

    var movePlayer = false;

    // Change the row
    for (let col = 0; col < 5; col++) {
      // Change room
      const updatedCol =
        direction === 'left' ? rotateToPositive(col) : rotateToNegative(col);
      newRoomDistribution[selectedRowIndex][col] =
        this.roomDistribution[selectedRowIndex][updatedCol];

      // Persist index
      newRoomDistribution[selectedRowIndex][col].updatePosition(
        selectedRowIndex,
        col
      );

      // Check if need to move player
      if (samePosition([selectedRowIndex, col], this.player.getPosition())) {
        movePlayer = true;
      }
    }

    // Move player
    if (movePlayer) {
      const [playerRowIndex, playerColIndex] = this.player.getPosition();
      const updatedCol =
        direction === 'left'
          ? rotateToNegative(playerColIndex)
          : rotateToPositive(playerColIndex);

      this.player.updatePosition(playerRowIndex, updatedCol);
    }

    // Update the room distribution
    this.roomDistribution = newRoomDistribution;
  }

  localFromIndexToID(rowIndex: number, colIndex: number): number {
    return fromIndexToID(rowIndex, colIndex);
  }
}

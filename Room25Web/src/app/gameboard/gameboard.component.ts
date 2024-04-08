import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

import { RoomComponent } from '../room/room.component';
import { PlayerComponent } from '../player/player.component';

import { DangerousLevel } from '../dangerous-level.enum';
import { Action } from '../action.enum';
import { fromIndexToID, shuffle } from '../utils';

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

  roomDistribution: DangerousLevel[] = [
    ...Array(25).fill(DangerousLevel.GREEN),
  ];

  roomRevealed: boolean[] = [...Array(25).fill(true)];

  constructor() {
    // Randomly place rooms
    this.generateInitialBoard();

    // Reveal center
    this.roomRevealed[12] = true;
  }

  generateInitialBoard(): void {
    // put center
    this.roomDistribution[12] = DangerousLevel.BLUE;

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
      this.roomDistribution[nearIndices[i]] = firstSelection[i];
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
      this.roomDistribution[otherIndices[i]] = secondSelection[i];
    }
  }

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

  handleRoomClicked(event: { rowIndex: number; colIndex: number }): void {
    const selectedRowIndex = event.rowIndex;
    const selectedColIndex = event.colIndex;
    const selectedAction = Action.MOVE;

    const selectedRoom = this.roomComponents.find((room) => {
      return (
        room.rowIndex === selectedRowIndex && room.colIndex === selectedColIndex
      );
    });

    // Construct the message based on the action and room position
    const message = `Player performed ${this.player.action1} in room (${selectedColIndex} - ${selectedRowIndex})`;

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
      if (
        !this.roomRevealed[fromIndexToID(selectedRowIndex, selectedColIndex)] &&
        (selectedAction === Action.MOVE || selectedAction === Action.DRAG)
      ) {
        this.roomRevealed[fromIndexToID(selectedRowIndex, selectedColIndex)] =
          true;
      }
      // Perform room action

      // Recover Room
      this.showDefulatRoomTransparency();
    }
  }

  localFromIndexToID(rowIndex: number, colIndex: number): number {
    return fromIndexToID(rowIndex, colIndex);
  }
}

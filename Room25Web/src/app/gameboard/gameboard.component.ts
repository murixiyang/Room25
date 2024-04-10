import {
  Component,
  Renderer2,
  ElementRef,
  ViewChildren,
  QueryList,
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
  // Enum
  Action = Action;

  player = new PlayerComponent();

  // Game status
  selectingRoom = false;

  // Game setup
  redNum = 8;
  yellowNum = 10;
  greenNum = 4;
  blueNum = 2;

  // Room distribution
  roomDistribution: RoomComponent[][] = [];
  // To modify view of the rooms
  @ViewChildren(RoomComponent) roomViews!: QueryList<RoomComponent>;

  // Whether the room of the position index is revealed
  roomRevealed: boolean[] = [...Array(25).fill(true)];
  // The exact position to put arrow when dragging
  arrowPositions: { topPos: number; leftPos: number }[] = [];

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

  handleShowActionTarget(action: Action) {
    switch (action) {
      case Action.MOVE:
      case Action.PEEK:
        this.showAvailableRoomsForAction();
        break;
      case Action.PUSH:
        this.showAvailablePlayerForAction();
        // Then choose room
        break;
      case Action.DRAG:
        this.showAvailableDirectionForAction();
        break;
      default:
        break;
    }
  }

  // For MOVE and PEEK
  private showAvailableRoomsForAction() {
    // Make all rooms transparent
    this.roomViews.forEach((room) => {
      console.log(room);
      room.setTransparent(true);
    });

    // Make neighbour room not transparent
    this.getNeighbourRooms(this.player.getPosition()).forEach((room) => {
      console.log(room);

      room.setTransparent(false);
      room.selectable = true;
    });

    // Change phase
    this.selectingRoom = true;
  }

  private showDefulatRoomTransparency() {
    this.roomViews.forEach((room) => {
      room.setTransparent(false);
      room.selectable = false;
    });
  }

  // For PUSH
  private showAvailablePlayerForAction() {}

  // For DRAG
  private showAvailableDirectionForAction() {
    console.log('triggered');

    // Find the corresponding room component
    const [rowIndex, colIndex] = this.player.getPosition();

    const relativeRooms: RoomComponent[] = [];
    // relativeRooms.push(this.roomComponents[(rowIndex, 0)]);

    this.arrowPositions.push({ topPos: rowIndex * 20, leftPos: 0 }); // Left arrow
    this.arrowPositions.push({
      topPos: rowIndex * 20,
      leftPos: 4 * 20,
    }); // Right arrow

    // Calculate up and down arrows
    this.arrowPositions.push({ topPos: 0, leftPos: colIndex * 20 }); // Up arrow
    this.arrowPositions.push({
      topPos: 4 * 20,
      leftPos: colIndex * 20,
    }); // Down arrow
  }

  // For MOVE, PEEK
  handleRoomClicked(event: { rowIndex: number; colIndex: number }): void {
    // If not selectingRoom, dont do anything
    if (!this.selectingRoom) {
      return;
    }

    const selectedRowIndex = event.rowIndex;
    const selectedColIndex = event.colIndex;

    const selectedAction = Action.DRAG;

    console.log(`Clicked room (${selectedRowIndex}, ${selectedColIndex})`);

    const selectedRoom = this.roomDistribution.flat().find((room) => {
      return samePosition(room.getPosition(), [
        selectedRowIndex,
        selectedColIndex,
      ]);
    });

    // Construct the message based on the action and room position
    const message = `Player performed ${selectedAction} in room (${selectedRowIndex} - ${selectedColIndex})`;

    // Display the message
    if (this.selectingRoom && selectedRoom?.selectable) {
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

  private dragRow(selectedRowIndex: number, direction: 'left' | 'right'): void {
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

  private getNeighbourRooms(
    selectedPosition: [number, number]
  ): RoomComponent[] {
    const [selectedRowIndex, selectedColIndex] = selectedPosition;
    console.log('Get neighbour of: ' + selectedPosition);
    // Filter room components to find neighbor rooms
    return this.roomViews.filter((room) => {
      const roomPosition = room.getPosition();
      return (
        samePosition(roomPosition, [selectedRowIndex - 1, selectedColIndex]) ||
        samePosition(roomPosition, [selectedRowIndex + 1, selectedColIndex]) ||
        samePosition(roomPosition, [selectedRowIndex, selectedColIndex - 1]) ||
        samePosition(roomPosition, [selectedRowIndex, selectedColIndex + 1])
      );
    });
  }

  localFromIndexToID(rowIndex: number, colIndex: number): number {
    return fromIndexToID(rowIndex, colIndex);
  }
}

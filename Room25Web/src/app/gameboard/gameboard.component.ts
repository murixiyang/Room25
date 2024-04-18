import { Component, ViewChildren, QueryList } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

import { RoomComponent } from '../room/room.component';
import { PlayerComponent } from '../player/player.component';

import { Action } from '../action.enum';
import { rotateToNegative } from '../utils';
import fromIndexToID, { samePosition, rotateToPositive } from '../utils';
import { Room } from '../room/room.model';

import { RoomService } from '../room/room.service';
import { GameboardService } from './gameboard.service';
import { RoomColorNum } from '../types/roomColorNum.model';
import { ArrowPosition } from '../types/arrowPosition.model';

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
  roomColorNum: RoomColorNum = {
    redNum: 8,
    yellowNum: 10,
    greenNum: 4,
    blueNum: 2,
  };

  // Room distribution
  roomDistribution: Room[][] = [];
  // To modify view of the rooms
  @ViewChildren(RoomComponent) roomViews!: QueryList<RoomComponent>;

  // Whether the room of the position index is revealed
  // The exact position to put arrow when dragging
  arrowPositions: ArrowPosition[] = [];

  constructor(
    private roomSvc: RoomService,
    private gameboardSvc: GameboardService
  ) {
    // Randomly place rooms
    this.gameboardSvc.generateInitialBoard(
      this.roomDistribution,
      this.roomColorNum
    );

    // Reveal centre
    this.roomSvc.revealRoom(this.roomDistribution[2][2]);
  }

  getPlayer(): PlayerComponent {
    return this.player;
  }

  handleShowActionTarget(action: Action) {
    switch (action) {
      case Action.MOVE:
      case Action.PEEK:
        this.gameboardSvc.showAvailableRoomsForAction(
          this.roomDistribution,
          this.roomViews,
          this.player
        );

        // Change phase
        this.selectingRoom = true;
        break;
      case Action.PUSH:
        this.gameboardSvc.showAvailablePlayerForAction();
        // TODO: Then choose room
        break;
      case Action.DRAG:
        this.arrowPositions = this.gameboardSvc.showAvailableDirectionForAction(
          this.roomDistribution,
          this.roomViews,
          this.player
        );
        break;
      default:
        break;
    }
  }

  // For MOVE, PEEK
  handleRoomClicked(event: { rowIndex: number; colIndex: number }): void {
    // If not selectingRoom, dont do anything
    if (!this.selectingRoom) {
      return;
    }

    const selectedRowIndex = event.rowIndex;
    const selectedColIndex = event.colIndex;

    const selectedAction = Action.MOVE;

    console.log(`Clicked room (${selectedRowIndex}, ${selectedColIndex})`);

    const selectedRoom =
      this.roomDistribution[selectedRowIndex][selectedColIndex];

    // Construct the message based on the action and room position
    const message = `Player performed ${selectedAction} in room (${selectedRowIndex} - ${selectedColIndex})`;

    // Display the message
    if (this.selectingRoom && selectedRoom.selectable) {
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

      // Recover Room
      this.gameboardSvc.showDefulatRoomTransparency(
        this.roomDistribution,
        this.roomViews
      );
      // Change phase
      this.selectingRoom = false;
    }
  }

  handleDrag(direction: 'left' | 'right' | 'up' | 'down') {
    const selectedDirection = direction;
    // Clear arrow
    this.arrowPositions = [];
    console.log(selectedDirection);
    switch (selectedDirection) {
      case 'left':
      case 'right':
        this.dragRow(this.player.getRowIndex(), selectedDirection);
        break;
      case 'up':
      case 'down':
        this.dragCol(this.player.getColIndex(), selectedDirection);
    }
  }

  private dragRow(selectedRowIndex: number, direction: 'left' | 'right'): void {
    const newRoomDistribution: Room[][] = [];
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
      this.roomSvc.updatePosition(
        newRoomDistribution[selectedRowIndex][col],
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

  private dragCol(selectedColIndex: number, direction: 'up' | 'down'): void {
    const newRoomDistribution: Room[][] = [];
    // Make deep copy
    for (let row = 0; row < 5; row++) {
      newRoomDistribution[row] = [];
      for (let col = 0; col < 5; col++) {
        newRoomDistribution[row][col] = this.roomDistribution[row][col];
      }
    }

    var movePlayer = false;

    // Change the row
    for (let row = 0; row < 5; row++) {
      // Change room
      const updatedRow =
        direction === 'up' ? rotateToPositive(row) : rotateToNegative(row);
      newRoomDistribution[row][selectedColIndex] =
        this.roomDistribution[updatedRow][selectedColIndex];

      // Persist index
      this.roomSvc.updatePosition(
        newRoomDistribution[row][selectedColIndex],
        row,
        selectedColIndex
      );

      // Check if need to move player
      if (samePosition([row, selectedColIndex], this.player.getPosition())) {
        movePlayer = true;
      }
    }

    // Move player
    if (movePlayer) {
      const [playerRowIndex, playerColIndex] = this.player.getPosition();
      const updatedRow =
        direction === 'up'
          ? rotateToNegative(playerRowIndex)
          : rotateToPositive(playerRowIndex);

      this.player.updatePosition(updatedRow, playerColIndex);
    }

    // Update the room distribution
    this.roomDistribution = newRoomDistribution;
  }

  localFromIndexToID(rowIndex: number, colIndex: number): number {
    return fromIndexToID(rowIndex, colIndex);
  }

  private getRoomViewFromRoom(selectedRoom: Room): RoomComponent {
    return this.roomViews.get(selectedRoom.id)!;
  }

  getDirectionFromArrowIndex(index: number): 'left' | 'right' | 'up' | 'down' {
    switch (index) {
      case 0:
        return 'left';
      case 1:
        return 'right';
      case 2:
        return 'up';
      default:
        return 'down';
    }
  }
}

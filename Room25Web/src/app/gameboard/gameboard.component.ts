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
import { Player } from '../player/player.model';
import { PlayerService } from '../player/player.service';

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

  player: Player = {
    name: 'Frank',
    rowIndex: 2,
    colIndex: 2,
    survived: true,
    action1: Action.NONE,
    action2: Action.NONE,
    action3: Action.NONE,
  };

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
    private playerSvc: PlayerService,
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

  getPlayer(): Player {
    return this.player;
  }

  // When action selected
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

      // Move player and cleanup format
      this.gameboardSvc.selectRoom(
        this.roomDistribution,
        this.roomViews,
        this.player,
        event,
        selectedAction
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
        this.roomDistribution = this.gameboardSvc.dragRow(
          this.roomDistribution,
          this.player,
          selectedDirection
        );
        break;
      case 'up':
      case 'down':
        this.roomDistribution = this.gameboardSvc.dragCol(
          this.roomDistribution,
          this.player,
          selectedDirection
        );
    }
  }

  localFromIndexToID(rowIndex: number, colIndex: number): number {
    return fromIndexToID(rowIndex, colIndex);
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

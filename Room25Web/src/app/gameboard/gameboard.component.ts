import {
  Component,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

import { RoomComponent } from '../room/room.component';
import { PlayerComponent } from '../player/player.component';

import { Action } from '../action.enum';
import fromIndexToID from '../utils';
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

  actionPhase: number = 0;

  // Create player
  player: Player = {
    name: 'Frank',
    playerPos: {
      rowIndex: 2,
      colIndex: 2,
    },

    survived: true,
    actions: [Action.NONE, Action.NONE, Action.NONE],
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
  @ViewChild(PlayerComponent) playerView!: PlayerComponent;

  // Whether the room of the position index is revealed
  // The exact position to put arrow when dragging
  arrowPositions: ArrowPosition[] = [];

  @Output() triggerActionFinished: EventEmitter<number> =
    new EventEmitter<number>();

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

  // When receive confirmed action from plan board
  playerAssignAction(event: Action[]) {
    this.playerView.assignAction(event);
  }

  // When action selected
  handleShowActionTarget(actionNumber: number) {
    const action = this.playerView.player.actions[actionNumber - 1];
    this.actionPhase = actionNumber;

    switch (action) {
      case Action.MOVE:
      case Action.PEEK:
        this.gameboardSvc.showAvailableRoomsForAction(
          this.roomDistribution,
          this.roomViews,
          this.playerView.player
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
          this.playerView.player
        );
        break;
      default:
        this.handleActionFinishPhase();
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

    const selectedAction = this.playerView.player.actions[this.actionPhase - 1];

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
        this.playerView.player,
        event,
        selectedAction
      );

      // Change phase back
      this.selectingRoom = false;
    }

    this.handleActionFinishPhase();
  }

  handleDrag(direction: 'left' | 'right' | 'up' | 'down') {
    const selectedDirection = direction;
    // Clear arrow
    this.arrowPositions = [];
    switch (selectedDirection) {
      case 'left':
      case 'right':
        this.roomDistribution = this.gameboardSvc.dragRow(
          this.roomDistribution,
          this.playerView.player,
          selectedDirection
        );
        break;
      case 'up':
      case 'down':
        this.roomDistribution = this.gameboardSvc.dragCol(
          this.roomDistribution,
          this.playerView.player,
          selectedDirection
        );
        break;
    }

    this.handleActionFinishPhase();
  }

  handleActionFinishPhase() {
    console.log('Gameboard Trigger: Action finish');
    this.triggerActionFinished.emit(this.actionPhase);
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

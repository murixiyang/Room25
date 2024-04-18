import { Injectable, QueryList } from '@angular/core';
import { Room } from '../room/room.model';
import fromIndexToID, {
  fromViewIDToIndex,
  samePosition,
  shuffle,
} from '../utils';
import { DangerousLevel } from '../dangerous-level.enum';
import { LockStatus } from '../lock-status.enum';
import { RoomColorNum } from '../types/roomColorNum.model';
import { Action } from '../action.enum';
import { RoomComponent } from '../room/room.component';
import { RoomService } from '../room/room.service';
import { Position } from '../types/position.model';
import { PlayerComponent } from '../player/player.component';
import { ArrowPosition } from '../types/arrowPosition.model';

@Injectable({
  providedIn: 'root',
})
export class GameboardService {
  constructor(private roomSvc: RoomService) {}

  generateInitialBoard(
    roomDistribution: Room[][],
    roomColorNum: RoomColorNum
  ): void {
    // Create RoomComponent instances and put them in roomDistribution
    for (let row = 0; row < 5; row++) {
      roomDistribution[row] = [];
      for (let col = 0; col < 5; col++) {
        const id = fromIndexToID(row, col);

        // Create room
        const room: Room = {
          rowIndex: row,
          colIndex: col,
          dangerousLevel: DangerousLevel.GREEN,
          lockStatus: LockStatus.AVAILABLE,
          id: id,
          revealed: true,
          selectable: false,
        };

        roomDistribution[row][col] = room;
      }
    }

    // put center
    roomDistribution[2][2].dangerousLevel = DangerousLevel.BLUE;

    // Shuffle and select indices for red, yellow, and green rooms
    const nearIndices = [2, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18, 22];
    const otherIndices = [0, 1, 3, 4, 5, 9, 15, 19, 20, 21, 23, 24];

    const firstSelection = [
      ...Array(roomColorNum.redNum).fill(DangerousLevel.RED),
      ...Array(roomColorNum.yellowNum).fill(DangerousLevel.YELLOW),
      ...Array(roomColorNum.greenNum).fill(DangerousLevel.GREEN),
    ];
    shuffle(firstSelection);

    // Assign red, yellow, and green rooms to selected indices
    for (let i = 0; i < nearIndices.length; i++) {
      const [rowIndex, colIndex] = fromViewIDToIndex(nearIndices[i]);
      roomDistribution[rowIndex][colIndex].dangerousLevel = firstSelection[i];
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
    const remainingRed = roomColorNum.redNum - placedRed;
    const remainingYellow = roomColorNum.yellowNum - placedYellow;
    const remainingGreen = roomColorNum.greenNum - placedGreen;

    // Shuffle the rest
    const secondSelection = [
      ...Array(remainingRed).fill(DangerousLevel.RED),
      ...Array(remainingYellow).fill(DangerousLevel.YELLOW),
      ...Array(remainingGreen).fill(DangerousLevel.GREEN),
      ...Array(roomColorNum.blueNum).fill(DangerousLevel.BLUE),
    ];
    shuffle(secondSelection);

    // Assign red, yellow, and green rooms to selected indices
    for (let i = 0; i < otherIndices.length; i++) {
      const [rowIndex, colIndex] = fromViewIDToIndex(otherIndices[i]);
      roomDistribution[rowIndex][colIndex].dangerousLevel = secondSelection[i];
    }
  }

  // For MOVE and PEEK
  showAvailableRoomsForAction(
    roomDistribution: Room[][],
    roomViews: QueryList<RoomComponent>,
    player: PlayerComponent
  ) {
    // Make all rooms transparent
    roomViews.forEach((room) => {
      room.setTransparent(true);
    });

    // Make neighbour room not transparent
    this.getNeighbourRooms(roomDistribution, player.getPosition()).forEach(
      (room) => {
        console.log('Neighbour id: ', room.id);
        // Get roomView
        const roomView = this.getRoomViewFromRoom(roomViews, room);

        roomView.setTransparent(false);
        roomView.setSelectable(true);
      }
    );
  }

  showDefulatRoomTransparency(
    roomDistribution: Room[][],
    roomViews: QueryList<RoomComponent>
  ) {
    roomDistribution.flat().forEach((room) => {
      const roomView = this.getRoomViewFromRoom(roomViews, room);

      roomView.setTransparent(false);
      roomView.setSelectable(true);
    });
  }

  // For PUSH
  showAvailablePlayerForAction() {}

  // For DRAG
  showAvailableDirectionForAction(
    roomDistribution: Room[][],
    roomViews: QueryList<RoomComponent>,
    player: PlayerComponent
  ): ArrowPosition[] {
    console.log('triggered');

    // Find the corresponding room component
    const [rowIndex, colIndex] = player.getPosition();
    var roomWidth = 0;

    // The 4 related rooms
    const relativeRooms: Room[] = [];
    relativeRooms.push(roomDistribution[rowIndex][0]);
    relativeRooms.push(roomDistribution[rowIndex][4]);
    relativeRooms.push(roomDistribution[0][colIndex]);
    relativeRooms.push(roomDistribution[4][colIndex]);

    // Initial position for arrow
    const arrowPositions: ArrowPosition[] = [];

    relativeRooms.forEach((room) => {
      const roomView = this.getRoomViewFromRoom(roomViews, room);
      roomWidth = roomView.getRoomWidth();
      arrowPositions.push({
        topPos: roomView.getAbsRoomPos().topPos,
        leftPos: roomView.getAbsRoomPos().leftPos,
        available: true,
      });
    });

    // Refine position for arrow
    arrowPositions[0].topPos += roomWidth * 0.3;
    arrowPositions[0].leftPos -= roomWidth * 0.75;
    arrowPositions[1].topPos += roomWidth * 0.3;
    arrowPositions[1].leftPos += roomWidth * 1.2;
    arrowPositions[2].topPos -= roomWidth * 0.7;
    arrowPositions[2].leftPos += roomWidth * 0.25;
    arrowPositions[3].topPos += roomWidth * 1.2;
    arrowPositions[3].leftPos += roomWidth * 0.25;

    // centre arrow maynot beens show
    if (rowIndex === 2) {
      arrowPositions[0].available = false;
      arrowPositions[1].available = false;
      console.log('done');
    }

    if (colIndex === 2) {
      arrowPositions[2].available = false;
      arrowPositions[3].available = false;
    }

    // TODO: If drag to opposite before, not available

    return arrowPositions;
  }

  getNeighbourRooms(
    roomDistribution: Room[][],
    selectedPosition: [number, number]
  ): Room[] {
    const [selectedRowIndex, selectedColIndex] = selectedPosition;
    console.log('Get neighbour of: ' + selectedPosition);
    // Filter room components to find neighbor rooms
    return roomDistribution.flat().filter((room) => {
      const roomPosition = this.roomSvc.getPosition(room);
      return (
        samePosition(roomPosition, [selectedRowIndex - 1, selectedColIndex]) ||
        samePosition(roomPosition, [selectedRowIndex + 1, selectedColIndex]) ||
        samePosition(roomPosition, [selectedRowIndex, selectedColIndex - 1]) ||
        samePosition(roomPosition, [selectedRowIndex, selectedColIndex + 1])
      );
    });
  }

  getRoomViewFromRoom(
    roomViews: QueryList<RoomComponent>,
    selectedRoom: Room
  ): RoomComponent {
    return roomViews.get(
      fromIndexToID(selectedRoom.rowIndex, selectedRoom.colIndex)
    )!;
  }
}

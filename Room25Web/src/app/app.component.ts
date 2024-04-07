import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { RoomComponent } from './room/room.component';
import { DangerousLevel } from './dangerous-level.enum';
import { LockStatus } from './lock-status.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RoomComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Room25Web';

  // Define static properties for enums
  DangerousLevel = DangerousLevel;
  LockStatus = LockStatus;
}

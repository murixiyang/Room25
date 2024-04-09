import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GameboardComponent } from './gameboard/gameboard.component';
import { ActionChooseBoardComponent } from './action-choose-board/action-choose-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameboardComponent, ActionChooseBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Room25Web';
}

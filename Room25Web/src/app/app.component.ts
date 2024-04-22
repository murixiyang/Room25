import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GameboardComponent } from './gameboard/gameboard.component';
import { ActionplanComponent } from './actionplan/actionplan.component';
import { TimelineComponent } from './timeline/timeline.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GameboardComponent,
    ActionplanComponent,
    TimelineComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Room25Web';
}

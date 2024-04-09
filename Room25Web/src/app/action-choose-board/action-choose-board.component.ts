import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { GameboardComponent } from '../gameboard/gameboard.component';

@Component({
  selector: 'app-action-choose-board',
  standalone: true,
  imports: [GameboardComponent, NgClass],
  templateUrl: './action-choose-board.component.html',
  styleUrl: './action-choose-board.component.css',
})
export class ActionChooseBoardComponent {
  gameboard!: GameboardComponent;
}

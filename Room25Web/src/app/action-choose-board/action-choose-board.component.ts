import { Component, EventEmitter, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { Action } from '../action.enum';

@Component({
  selector: 'app-action-choose-board',
  standalone: true,
  imports: [GameboardComponent, NgClass],
  templateUrl: './action-choose-board.component.html',
  styleUrl: './action-choose-board.component.css',
})
export class ActionChooseBoardComponent {
  Action = Action;

  @Output() triggerActionChoose: EventEmitter<Action> =
    new EventEmitter<Action>();

  // When choose an action
  onClickButton(selectedAction: Action) {
    this.triggerActionChoose.emit(selectedAction);
  }
}

import { Component } from '@angular/core';
import { Action } from '../action.enum';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionClassMap } from '../action.enum';

@Component({
  selector: 'app-actionplan',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './actionplan.component.html',
  styleUrl: './actionplan.component.css',
})
export class ActionplanComponent {
  ActionClassMap = ActionClassMap;
  Action = Action;

  action1: Action = Action.NONE;
  action2: Action = Action.NONE;
  action3: Action = Action.NONE;

  actionReady: boolean[] = [false, false, false];
  actionFinished: boolean[] = [false, false, false];
  action3Enabled: boolean = false;

  allActions: Action[] = Object.values(Action);

  enableAction3(enabled: boolean): void {
    this.action3Enabled = enabled;
  }

  getFilteredAction(forAction: 'action1' | 'action2'): Action[] {
    const againstAction = forAction === 'action1' ? this.action2 : this.action1;
    const result = this.allActions.filter((action) => action !== againstAction);
    if (!result.includes(Action.NONE)) {
      result.push(Action.NONE);
    }
    return result;
  }
}

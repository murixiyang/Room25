import { Component, EventEmitter, Output } from '@angular/core';
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

  private actionConfirmed: boolean = false;

  private actionReady: boolean[] = [false, false, false];
  private actionFinished: boolean[] = [false, false, false];
  private action3Enabled: boolean = false;

  allActions: Action[] = Object.values(Action);

  @Output() triggerActionConfirmed: EventEmitter<Action[]> = new EventEmitter<
    Action[]
  >();

  @Output() triggerAction: EventEmitter<number> = new EventEmitter<number>();

  setEnableAction3(enabled: boolean): void {
    this.action3Enabled = enabled;
  }

  getAction3Enabled(): boolean {
    return this.action3Enabled;
  }

  // When click confirm, lock Action1 and Action2. Then emit
  confirmAction(): void {
    // Set action to confirmed
    this.actionConfirmed = true;
    this.triggerActionConfirmed.emit([this.action1, this.action2]);

    // Ready first action
    this.setActionReady(1);
    // Trigger action1
    this.triggerAction.emit(1);
  }

  getActionConfirmed(): boolean {
    return this.actionConfirmed;
  }

  setActionReady(actionNumber: number): void {
    this.actionReady[actionNumber - 1] = true;
  }

  getActionReady(actionNumber: number): boolean {
    return this.actionReady[actionNumber - 1];
  }

  setActionFinished(actionNumber: number): void {
    this.actionFinished[actionNumber - 1] = true;
  }

  getActionFinished(actionNumber: number): boolean {
    return this.actionFinished[actionNumber - 1];
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

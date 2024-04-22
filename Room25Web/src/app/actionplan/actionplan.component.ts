import {
  Component,
  EventEmitter,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Action } from '../action.enum';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionClassMap } from '../action.enum';
import { ActionStatus } from '../action-status.enum';

@Component({
  selector: 'app-actionplan',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './actionplan.component.html',
  styleUrl: './actionplan.component.css',
})
export class ActionplanComponent implements OnChanges {
  ActionClassMap = ActionClassMap;
  Action = Action;
  ActionStatus = ActionStatus;

  actions: Action[] = [Action.NONE, Action.NONE, Action.NONE];

  private actionConfirmed: boolean = false;
  private action3Enabled: boolean = false;

  private actionStatus: ActionStatus[] = [
    ActionStatus.EMPTY,
    ActionStatus.EMPTY,
    ActionStatus.EMPTY,
  ];

  allActions: Action[] = Object.values(Action);

  @Output() triggerActionConfirmed: EventEmitter<Action[]> = new EventEmitter<
    Action[]
  >();

  @Output() triggerAction: EventEmitter<number> = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  setEnableAction3(enabled: boolean): void {
    this.action3Enabled = enabled;
  }

  getAction3Enabled(): boolean {
    return this.action3Enabled;
  }

  // When click confirm, lock Action1 and Action2. Then emit
  confirmAction(): void {
    // Set action to confirmed
    this.setActionStatus(1, ActionStatus.ASSIGNED);
    this.setActionStatus(2, ActionStatus.ASSIGNED);
    this.actionConfirmed = true;

    console.log('ActionPlan Trigger: Action Confirmed');
    this.triggerActionConfirmed.emit([this.actions[0], this.actions[1]]);

    this.executeAction(1);
  }

  executeAction(actionNumber: number) {
    // Ready action
    this.setActionReady(actionNumber);

    // Trigger action
    console.log(
      'ActionPlan Trigger: Action Start Execute, number: ',
      actionNumber
    );
    this.triggerAction.emit(actionNumber);
  }

  refreshAction() {
    this.actions = [Action.NONE, Action.NONE, Action.NONE];
    this.actionStatus = [
      ActionStatus.EMPTY,
      ActionStatus.EMPTY,
      ActionStatus.EMPTY,
    ];

    this.actionConfirmed = false;
    this.action3Enabled = false;
  }

  getActionConfirmed(): boolean {
    return this.actionConfirmed;
  }

  setActionStatus(actionNumber: number, status: ActionStatus): void {
    this.actionStatus[actionNumber - 1] = status;
  }

  setActionReady(actionNumber: number): void {
    this.actionStatus[actionNumber - 1] = ActionStatus.READY;
  }

  setActionFinished(actionNumber: number): void {
    this.actionStatus[actionNumber - 1] = ActionStatus.FINISHED;
  }

  getActionStatus(actionNumber: number): ActionStatus {
    return this.actionStatus[actionNumber - 1];
  }

  getFilteredAction(forAction: 'action1' | 'action2'): Action[] {
    const againstAction =
      forAction === 'action1' ? this.actions[1] : this.actions[0];
    const result = this.allActions.filter((action) => action !== againstAction);
    if (!result.includes(Action.NONE)) {
      result.push(Action.NONE);
    }
    return result;
  }
}

import { Component } from '@angular/core';
import { Action } from '../action.enum';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-actionplan',
  standalone: true,
  imports: [NgIf],
  templateUrl: './actionplan.component.html',
  styleUrl: './actionplan.component.css',
})
export class ActionplanComponent {
  action1!: Action;
  action2!: Action;
  action3!: Action;

  actionReady: boolean[] = [false, false, false];
  actionFinished: boolean[] = [false, false, false];
  action3Enabled: boolean = false;

  enableAction3(enabled: boolean): void {
    this.action3Enabled = enabled;
  }
}

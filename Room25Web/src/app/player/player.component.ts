import { Component, Input } from '@angular/core';
import { Action } from '../action.enum';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent {
  @Input() name: string = 'Frank';
  @Input() rowIndex: number = 2;
  @Input() colIndex: number = 2;
  @Input() survived: boolean = true;

  @Input() action1!: Action;
  @Input() action2!: Action;
  @Input() action3!: Action;

  constructor() {}
}

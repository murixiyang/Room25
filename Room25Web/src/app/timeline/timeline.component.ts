import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerComponent } from '../player/player.component';
import { Player } from '../player/player.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent {
  @Input() private totalRound: number = 10;
  @Input() private leftRound: number = 10;
  @Input() private passedRound: number = 0;
  // Action1 or 2 or 3
  @Input() private currentPhase: 1 | 2 | 3 = 1;

  @Input() player!: Player;

  @Output() triggerFinishAction: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() triggerNextAction: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() triggerNextRound: EventEmitter<void> = new EventEmitter<void>();

  getTotalRound(): number {
    return this.totalRound;
  }

  getLeftRound(): number {
    return this.leftRound;
  }

  getPassedRound(): number {
    return this.passedRound;
  }

  getCurrentPhase(): number {
    return this.currentPhase;
  }

  goToNextPhase(): number {
    console.log('Timer Trigger: Phase end: ', this.currentPhase);
    this.triggerFinishAction.emit(this.currentPhase);

    if (this.currentPhase === 3) {
      this.currentPhase = 1;
      this.leftRound--;
      this.passedRound++;

      console.log('Timer Trigger: Next round: ', this.leftRound);
      this.triggerNextRound.emit();
      return this.currentPhase;
    } else {
      this.currentPhase++;
    }

    console.log(
      'Timer Trigger: Trigger next action. phase: ',
      this.currentPhase
    );
    this.triggerNextAction.emit(this.currentPhase);

    return this.currentPhase;
  }
}

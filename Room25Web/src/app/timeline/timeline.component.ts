import { Component, Input } from '@angular/core';
import { PlayerComponent } from '../player/player.component';

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

  @Input() player!: PlayerComponent;

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
    if (this.currentPhase === 3) {
      this.currentPhase = 1;
      this.leftRound--;
      this.passedRound++;
    } else {
      this.currentPhase++;
    }

    return this.currentPhase;
  }
}

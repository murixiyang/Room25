import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgClass } from '@angular/common';
import { ActionChooseBoardComponent } from './action-choose-board.component';

describe('ActionChooseBoardComponent', () => {
  let component: ActionChooseBoardComponent;
  let fixture: ComponentFixture<ActionChooseBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionChooseBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionChooseBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleExam } from './schedule-exam';

describe('ScheduleExam', () => {
  let component: ScheduleExam;
  let fixture: ComponentFixture<ScheduleExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleExam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

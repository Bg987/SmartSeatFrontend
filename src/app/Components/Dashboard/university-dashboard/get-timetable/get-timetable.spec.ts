import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTimetable } from './get-timetable';

describe('GetTimetable', () => {
  let component: GetTimetable;
  let fixture: ComponentFixture<GetTimetable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetTimetable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetTimetable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

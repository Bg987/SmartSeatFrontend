import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeTable } from './add-time-table';

describe('AddTimeTable', () => {
  let component: AddTimeTable;
  let fixture: ComponentFixture<AddTimeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTimeTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTimeTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

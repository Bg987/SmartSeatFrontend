import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubjects } from './add-subjects';

describe('AddSubjects', () => {
  let component: AddSubjects;
  let fixture: ComponentFixture<AddSubjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetIncompleteExam } from './get-incomplete-exam';

describe('GetIncompleteExam', () => {
  let component: GetIncompleteExam;
  let fixture: ComponentFixture<GetIncompleteExam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetIncompleteExam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetIncompleteExam);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

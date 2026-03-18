import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetExamPassword } from './get-exam-password';

describe('GetExamPassword', () => {
  let component: GetExamPassword;
  let fixture: ComponentFixture<GetExamPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetExamPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetExamPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

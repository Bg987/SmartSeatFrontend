import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionGeneration } from './question-generation';

describe('QuestionGeneration', () => {
  let component: QuestionGeneration;
  let fixture: ComponentFixture<QuestionGeneration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionGeneration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionGeneration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

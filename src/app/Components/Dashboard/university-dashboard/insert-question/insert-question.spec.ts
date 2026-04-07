import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertQuestion } from './insert-question';

describe('InsertQuestion', () => {
  let component: InsertQuestion;
  let fixture: ComponentFixture<InsertQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertQuestion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

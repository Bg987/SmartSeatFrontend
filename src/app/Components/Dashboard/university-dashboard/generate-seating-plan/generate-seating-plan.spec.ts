import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSeatingPlan } from './generate-seating-plan';

describe('GenerateSeatingPlan', () => {
  let component: GenerateSeatingPlan;
  let fixture: ComponentFixture<GenerateSeatingPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateSeatingPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateSeatingPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

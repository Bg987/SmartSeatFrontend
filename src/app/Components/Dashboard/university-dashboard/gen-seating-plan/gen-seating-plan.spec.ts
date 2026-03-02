import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenSeatingPlan } from './gen-seating-plan';

describe('GenSeatingPlan', () => {
  let component: GenSeatingPlan;
  let fixture: ComponentFixture<GenSeatingPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenSeatingPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenSeatingPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

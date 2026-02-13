import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SittingPlan } from './sitting-plan';

describe('SittingPlan', () => {
  let component: SittingPlan;
  let fixture: ComponentFixture<SittingPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SittingPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SittingPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

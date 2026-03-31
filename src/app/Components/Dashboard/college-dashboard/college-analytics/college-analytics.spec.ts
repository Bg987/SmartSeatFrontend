import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeAnalytics } from './college-analytics';

describe('CollegeAnalytics', () => {
  let component: CollegeAnalytics;
  let fixture: ComponentFixture<CollegeAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

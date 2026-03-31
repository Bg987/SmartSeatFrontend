import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeAnalyticsComponent } from './college-analytics-component';

describe('CollegeAnalyticsComponent', () => {
  let component: CollegeAnalyticsComponent;
  let fixture: ComponentFixture<CollegeAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeAnalyticsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

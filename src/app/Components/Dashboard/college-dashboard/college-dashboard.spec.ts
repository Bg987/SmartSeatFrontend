import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeDashboard } from './college-dashboard';

describe('CollegeDashboard', () => {
  let component: CollegeDashboard;
  let fixture: ComponentFixture<CollegeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

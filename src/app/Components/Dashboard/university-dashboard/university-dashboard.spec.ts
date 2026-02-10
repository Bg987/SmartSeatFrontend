import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityDashboard } from './university-dashboard';

describe('UniversityDashboard', () => {
  let component: UniversityDashboard;
  let fixture: ComponentFixture<UniversityDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

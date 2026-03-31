import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsUniveristy } from './analytics-univeristy';

describe('AnalyticsUniveristy', () => {
  let component: AnalyticsUniveristy;
  let fixture: ComponentFixture<AnalyticsUniveristy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsUniveristy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsUniveristy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

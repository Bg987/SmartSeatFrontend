import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeLayout } from './college-layout';

describe('CollegeLayout', () => {
  let component: CollegeLayout;
  let fixture: ComponentFixture<CollegeLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

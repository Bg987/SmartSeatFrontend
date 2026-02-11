import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityLayout } from './university-layout';

describe('UniversityLayout', () => {
  let component: UniversityLayout;
  let fixture: ComponentFixture<UniversityLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

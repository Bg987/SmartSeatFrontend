import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCollegeDetail } from './show-college-detail';

describe('ShowCollegeDetail', () => {
  let component: ShowCollegeDetail;
  let fixture: ComponentFixture<ShowCollegeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCollegeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCollegeDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeHome } from './college-home';

describe('CollegeHome', () => {
  let component: CollegeHome;
  let fixture: ComponentFixture<CollegeHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

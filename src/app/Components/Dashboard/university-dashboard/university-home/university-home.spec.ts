import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityHome } from './university-home';

describe('UniversityHome', () => {
  let component: UniversityHome;
  let fixture: ComponentFixture<UniversityHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

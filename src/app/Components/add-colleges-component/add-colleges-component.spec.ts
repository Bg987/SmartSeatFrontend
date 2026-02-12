import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollegeComponent } from './add-colleges-component';

describe('AddCollegesComponent', () => {
  let component: AddCollegeComponent;
  let fixture: ComponentFixture<AddCollegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCollegeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCollegeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

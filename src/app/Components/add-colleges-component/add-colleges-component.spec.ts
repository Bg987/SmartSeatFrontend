import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollegesComponent } from './add-colleges-component';

describe('AddCollegesComponent', () => {
  let component: AddCollegesComponent;
  let fixture: ComponentFixture<AddCollegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCollegesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCollegesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

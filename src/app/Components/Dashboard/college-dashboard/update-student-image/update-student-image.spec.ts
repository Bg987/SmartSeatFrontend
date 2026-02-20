import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentImage } from './update-student-image';

describe('UpdateStudentImage', () => {
  let component: UpdateStudentImage;
  let fixture: ComponentFixture<UpdateStudentImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateStudentImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStudentImage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

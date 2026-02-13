import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadStudents } from './upload-students';

describe('UploadStudents', () => {
  let component: UploadStudents;
  let fixture: ComponentFixture<UploadStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadStudents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadStudents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

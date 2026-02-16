import { TestBed } from '@angular/core/testing';

import { AddStudent } from './add-student';

describe('AddStudent', () => {
  let service: AddStudent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddStudent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

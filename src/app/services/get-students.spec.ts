import { TestBed } from '@angular/core/testing';

import { GetStudents } from './get-students';

describe('GetStudents', () => {
  let service: GetStudents;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetStudents);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

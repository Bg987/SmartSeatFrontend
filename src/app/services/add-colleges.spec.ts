import { TestBed } from '@angular/core/testing';

import { AddColleges } from './add-colleges';

describe('AddColleges', () => {
  let service: AddColleges;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddColleges);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

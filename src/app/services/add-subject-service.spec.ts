import { TestBed } from '@angular/core/testing';

import { AddSubjectService } from './add-subject-service';

describe('AddSubjectService', () => {
  let service: AddSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

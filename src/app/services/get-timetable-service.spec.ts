import { TestBed } from '@angular/core/testing';

import { GetTimetableService } from './get-timetable-service';

describe('GetTimetableService', () => {
  let service: GetTimetableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTimetableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

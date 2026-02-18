import { TestBed } from '@angular/core/testing';

import { GetRooms } from './get-rooms';

describe('GetRooms', () => {
  let service: GetRooms;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRooms);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

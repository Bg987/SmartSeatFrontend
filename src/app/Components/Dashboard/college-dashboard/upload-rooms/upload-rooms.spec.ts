import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRooms } from './upload-rooms';

describe('UploadRooms', () => {
  let component: UploadRooms;
  let fixture: ComponentFixture<UploadRooms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadRooms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadRooms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

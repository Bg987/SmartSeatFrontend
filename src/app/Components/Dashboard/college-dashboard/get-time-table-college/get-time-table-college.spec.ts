import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTimeTableCollege } from './get-time-table-college';

describe('GetTimeTableCollege', () => {
  let component: GetTimeTableCollege;
  let fixture: ComponentFixture<GetTimeTableCollege>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetTimeTableCollege]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetTimeTableCollege);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

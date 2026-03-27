import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateResult } from './generate-result';

describe('GenerateResult', () => {
  let component: GenerateResult;
  let fixture: ComponentFixture<GenerateResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

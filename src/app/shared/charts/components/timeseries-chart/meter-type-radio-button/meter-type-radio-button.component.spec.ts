import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterTypeRadioButtonComponent } from './meter-type-radio-button.component';

describe('MeterTypeRadioButtonComponent', () => {
  let component: MeterTypeRadioButtonComponent;
  let fixture: ComponentFixture<MeterTypeRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterTypeRadioButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterTypeRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

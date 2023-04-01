import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTypeRadioButtonComponent } from './chart-type-radio-button.component';

describe('ChartTypeRadioButtonComponent', () => {
  let component: ChartTypeRadioButtonComponent;
  let fixture: ComponentFixture<ChartTypeRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartTypeRadioButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTypeRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyUsageBarchartComponent } from './energy-usage-barchart.component';

describe('SmallBarchartComponent', () => {
  let component: EnergyUsageBarchartComponent;
  let fixture: ComponentFixture<EnergyUsageBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnergyUsageBarchartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyUsageBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

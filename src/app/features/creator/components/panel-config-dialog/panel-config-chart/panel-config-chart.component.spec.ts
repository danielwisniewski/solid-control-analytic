import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfigChartComponent } from './panel-config-chart.component';

describe('PanelConfigChartComponent', () => {
  let component: PanelConfigChartComponent;
  let fixture: ComponentFixture<PanelConfigChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelConfigChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfigChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

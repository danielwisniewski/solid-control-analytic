import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTableToggleComponent } from './chart-table-toggle.component';

describe('ChartTableToggleComponent', () => {
  let component: ChartTableToggleComponent;
  let fixture: ComponentFixture<ChartTableToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartTableToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTableToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

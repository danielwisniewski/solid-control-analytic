import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCentersTableComponent } from './cost-centers-table.component';

describe('CostCentersTableComponent', () => {
  let component: CostCentersTableComponent;
  let fixture: ComponentFixture<CostCentersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCentersTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCentersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

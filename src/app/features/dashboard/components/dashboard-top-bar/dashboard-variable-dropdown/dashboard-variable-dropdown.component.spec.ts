import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVariableDropdownComponent } from './dashboard-variable-dropdown.component';

describe('DashboardVariableDropdownComponent', () => {
  let component: DashboardVariableDropdownComponent;
  let fixture: ComponentFixture<DashboardVariableDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardVariableDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardVariableDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

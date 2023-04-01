import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterTypeDropdownButtonComponent } from './meter-type-dropdown-button.component';

describe('MeterTypeDropdownButtonComponent', () => {
  let component: MeterTypeDropdownButtonComponent;
  let fixture: ComponentFixture<MeterTypeDropdownButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterTypeDropdownButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterTypeDropdownButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

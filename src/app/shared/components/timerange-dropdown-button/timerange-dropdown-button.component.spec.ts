import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerangeDropdownButtonComponent } from './timerange-dropdown-button.component';

describe('TimerangeDropdownButtonComponent', () => {
  let component: TimerangeDropdownButtonComponent;
  let fixture: ComponentFixture<TimerangeDropdownButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerangeDropdownButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerangeDropdownButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

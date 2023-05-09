import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerangeDropdownComponent } from './timerange-dropdown.component';

describe('TimerangeDropdownComponent', () => {
  let component: TimerangeDropdownComponent;
  let fixture: ComponentFixture<TimerangeDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerangeDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerangeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterAssignmentComponent } from './meter-assignment.component';

describe('MeterAssignmentComponent', () => {
  let component: MeterAssignmentComponent;
  let fixture: ComponentFixture<MeterAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeterAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyProfileLinechartComponent } from './daily-profile-linechart.component';

describe('DailyProfileLinechartComponent', () => {
  let component: DailyProfileLinechartComponent;
  let fixture: ComponentFixture<DailyProfileLinechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyProfileLinechartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyProfileLinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

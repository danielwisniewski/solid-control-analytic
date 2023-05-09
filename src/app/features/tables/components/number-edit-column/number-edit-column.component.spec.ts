import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberEditColumnComponent } from './number-edit-column.component';

describe('NumberEditColumnComponent', () => {
  let component: NumberEditColumnComponent;
  let fixture: ComponentFixture<NumberEditColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberEditColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberEditColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

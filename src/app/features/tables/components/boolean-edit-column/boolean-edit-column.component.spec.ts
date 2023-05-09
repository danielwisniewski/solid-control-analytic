import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanEditColumnComponent } from './boolean-edit-column.component';

describe('BooleanEditColumnComponent', () => {
  let component: BooleanEditColumnComponent;
  let fixture: ComponentFixture<BooleanEditColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooleanEditColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooleanEditColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

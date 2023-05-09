import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonActionColumnComponent } from './button-action-column.component';

describe('ButtonActionColumnComponent', () => {
  let component: ButtonActionColumnComponent;
  let fixture: ComponentFixture<ButtonActionColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonActionColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonActionColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

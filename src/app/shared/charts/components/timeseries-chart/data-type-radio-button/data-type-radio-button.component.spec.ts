import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTypeRadioButtonComponent } from './data-type-radio-button.component';

describe('DataTypeRadioButtonComponent', () => {
  let component: DataTypeRadioButtonComponent;
  let fixture: ComponentFixture<DataTypeRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTypeRadioButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

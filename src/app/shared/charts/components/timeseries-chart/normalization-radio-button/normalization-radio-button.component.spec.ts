import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalizationRadioButtonComponent } from './normalization-radio-button.component';

describe('NormalizationRadioButtonComponent', () => {
  let component: NormalizationRadioButtonComponent;
  let fixture: ComponentFixture<NormalizationRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormalizationRadioButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalizationRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

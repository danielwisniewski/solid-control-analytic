import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentilationComponent } from './ventilation.component';

describe('VentilationComponent', () => {
  let component: VentilationComponent;
  let fixture: ComponentFixture<VentilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

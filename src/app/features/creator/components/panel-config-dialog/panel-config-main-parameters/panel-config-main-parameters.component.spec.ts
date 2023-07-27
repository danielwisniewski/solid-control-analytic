import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfigMainParametersComponent } from './panel-config-main-parameters.component';

describe('PanelConfigMainParametersComponent', () => {
  let component: PanelConfigMainParametersComponent;
  let fixture: ComponentFixture<PanelConfigMainParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelConfigMainParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfigMainParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

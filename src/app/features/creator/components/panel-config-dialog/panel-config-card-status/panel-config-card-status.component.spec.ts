import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfigCardStatusComponent } from './panel-config-card-status.component';

describe('PanelConfigCardStatusComponent', () => {
  let component: PanelConfigCardStatusComponent;
  let fixture: ComponentFixture<PanelConfigCardStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelConfigCardStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfigCardStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

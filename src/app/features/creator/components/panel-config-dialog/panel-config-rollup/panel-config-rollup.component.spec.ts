import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfigRollupComponent } from './panel-config-rollup.component';

describe('PanelConfigRollupComponent', () => {
  let component: PanelConfigRollupComponent;
  let fixture: ComponentFixture<PanelConfigRollupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelConfigRollupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfigRollupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

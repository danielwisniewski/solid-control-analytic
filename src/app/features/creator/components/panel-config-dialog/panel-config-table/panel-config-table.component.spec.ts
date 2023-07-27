import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfigTableComponent } from './panel-config-table.component';

describe('PanelConfigTableComponent', () => {
  let component: PanelConfigTableComponent;
  let fixture: ComponentFixture<PanelConfigTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelConfigTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfigTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

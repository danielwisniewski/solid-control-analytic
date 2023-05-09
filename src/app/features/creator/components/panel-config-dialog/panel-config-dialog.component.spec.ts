import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfigDialogComponent } from './panel-config-dialog.component';

describe('PanelConfigDialogComponent', () => {
  let component: PanelConfigDialogComponent;
  let fixture: ComponentFixture<PanelConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelConfigDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelConfigTitlesComponent } from './panel-config-titles.component';

describe('PanelConfigTitlesComponent', () => {
  let component: PanelConfigTitlesComponent;
  let fixture: ComponentFixture<PanelConfigTitlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelConfigTitlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelConfigTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

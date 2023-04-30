import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollupSelectorComponent } from './rollup-selector.component';

describe('RollupSelectorComponent', () => {
  let component: RollupSelectorComponent;
  let fixture: ComponentFixture<RollupSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RollupSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RollupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

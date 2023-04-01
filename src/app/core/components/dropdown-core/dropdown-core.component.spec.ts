import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCoreComponent } from './dropdown-core.component';

describe('DropdownCoreComponent', () => {
  let component: DropdownCoreComponent;
  let fixture: ComponentFixture<DropdownCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownCoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

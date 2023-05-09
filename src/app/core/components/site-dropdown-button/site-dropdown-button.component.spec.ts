import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteDropdownButtonComponent } from './site-dropdown-button.component';

describe('SiteDropdownButtonComponent', () => {
  let component: SiteDropdownButtonComponent;
  let fixture: ComponentFixture<SiteDropdownButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteDropdownButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteDropdownButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

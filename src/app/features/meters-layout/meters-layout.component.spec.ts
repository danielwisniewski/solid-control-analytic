import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetersLayoutComponent } from './meters-layout.component';

describe('MetersComponent', () => {
  let component: MetersLayoutComponent;
  let fixture: ComponentFixture<MetersLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetersLayoutComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetersLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmmpConfigComponent } from './tmmp-config.component';

describe('TmmpConfigComponent', () => {
  let component: TmmpConfigComponent;
  let fixture: ComponentFixture<TmmpConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmmpConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TmmpConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringEditColumnComponent } from './string-edit-column.component';

describe('StringEditColumnComponent', () => {
  let component: StringEditColumnComponent;
  let fixture: ComponentFixture<StringEditColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringEditColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StringEditColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

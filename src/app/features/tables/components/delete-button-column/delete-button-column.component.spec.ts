import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteButtonColumnComponent } from './delete-button-column.component';

describe('DeleteButtonColumnComponent', () => {
  let component: DeleteButtonColumnComponent;
  let fixture: ComponentFixture<DeleteButtonColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteButtonColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteButtonColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

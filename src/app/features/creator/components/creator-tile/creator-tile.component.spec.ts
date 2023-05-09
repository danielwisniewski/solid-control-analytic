import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorTileComponent } from './creator-tile.component';

describe('CreatorTileComponent', () => {
  let component: CreatorTileComponent;
  let fixture: ComponentFixture<CreatorTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatorTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

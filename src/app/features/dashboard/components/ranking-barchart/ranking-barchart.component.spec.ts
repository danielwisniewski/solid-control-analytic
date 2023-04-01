import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingBarchartComponent } from './ranking-barchart.component';

describe('RankingBarchartComponent', () => {
  let component: RankingBarchartComponent;
  let fixture: ComponentFixture<RankingBarchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingBarchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

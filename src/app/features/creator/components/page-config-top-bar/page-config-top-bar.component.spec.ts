import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageConfigTopBarComponent } from './page-config-top-bar.component';

describe('CreatorMenuComponent', () => {
  let component: PageConfigTopBarComponent;
  let fixture: ComponentFixture<PageConfigTopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageConfigTopBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageConfigTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

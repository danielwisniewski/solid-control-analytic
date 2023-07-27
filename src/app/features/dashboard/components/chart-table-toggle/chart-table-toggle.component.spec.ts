import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ChartTableToggleComponent } from './chart-table-toggle.component';
import { AppState } from 'src/app/state';
import {
  changeActivePanelId,
  changePanelConfiguration,
} from 'src/app/core/store/pages/panels.actions';

describe('ChartTableToggleComponent', () => {
  let component: ChartTableToggleComponent;
  let fixture: ComponentFixture<ChartTableToggleComponent>;
  let store: Store<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})], // Add necessary imports and providers
      declarations: [ChartTableToggleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTableToggleComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('tileType$', () => {
    it('should return the tile type from the store', () => {
      const tileType = 'chart';
      const mockTile = { tile: component.tileId, type: tileType };
      spyOn(store, 'select').and.returnValue(
        of({ layout: { tiles: [mockTile] } })
      );

      component.tileType$.subscribe((result) => {
        expect(result).toBe(tileType);
      });
    });
  });

  describe('onTypeChange', () => {
    it('should dispatch changeActivePanelIndex and changePanelType actions', () => {
      const type = 'table';
      const dispatchSpy = spyOn(store, 'dispatch');
      const expectedActions = [
        changeActivePanelId({ id: component.tileId }),
        changePanelConfiguration({ panelType: type }),
      ];

      component.onTypeChange(type);

      expect(dispatchSpy.calls.allArgs()).toEqual(
        jasmine.arrayContaining(expectedActions)
      );
    });
  });
});

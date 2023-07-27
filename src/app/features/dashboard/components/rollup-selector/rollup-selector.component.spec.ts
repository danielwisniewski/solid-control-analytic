import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RollupSelectorComponent } from './rollup-selector.component';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { AppState } from 'src/app/state';
import {
  changeActivePanelId,
  changePanelParameters,
} from 'src/app/core/store/pages/panels.actions';

describe('RollupSelectorComponent', () => {
  let component: RollupSelectorComponent;
  let fixture: ComponentFixture<RollupSelectorComponent>;
  let store: Store<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})], // Add necessary imports and providers
      declarations: [RollupSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RollupSelectorComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update data on initialization', () => {
    const updateDataSpy = spyOn(component as any, 'updateData');
    component.ngOnInit();
    expect(updateDataSpy).toHaveBeenCalled();
  });

  it('should update data when tile is provided', () => {
    const tileId = 123;
    component.tile = { tile: tileId, cols: 12, rows: 3, type: 'chart' };
    const dispatchSpy = spyOn(store, 'dispatch');
    component['updateData']();
    expect(dispatchSpy).toHaveBeenCalledWith(
      changeActivePanelId({ id: tileId })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      changePanelParameters({
        parameter: 'rollup',
        value: component.activeRollup,
      })
    );
  });

  it('should call updateData when onRollupChangeFunc is called', () => {
    const updateDataSpy = spyOn(component as any, 'updateData');
    const rollup = { display: 'W', value: '1week' };
    component.tile = { tile: 123, cols: 12, rows: 6, type: 'chart' };
    component.onRollupChangeFunc(rollup);
    expect(component.activeRollup).toEqual(rollup);
    expect(updateDataSpy).toHaveBeenCalled();
  });

  it('should track items by display value', () => {
    const rollupOptions = [
      { display: 'D', value: '1day' },
      { display: 'W', value: '1week' },
    ];
    const index = 1;
    const item = rollupOptions[index];
    const trackByResult = component.trackBy(index, item);
    expect(trackByResult).toBe(item.display);
  });

  it('should unsubscribe from pageSub on ngOnDestroy', () => {
    const unsubscribeSpy = spyOn(component['pageSub'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});

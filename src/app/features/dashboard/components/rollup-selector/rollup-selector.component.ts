import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { Panel, RollupOption } from '../../interfaces/panel.interface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import {
  changeActivePanelId,
  changePanelParameters,
  fetchPanelData,
} from 'src/app/core/store/pages/panels.actions';

interface RollupData {
  panelId: string;
  rollup: RollupOption;
}

@Component({
  selector: 'app-rollup-selector',
  templateUrl: './rollup-selector.component.html',
  styleUrls: ['./rollup-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RollupSelectorComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  @Input() tile: Panel | undefined;

  activeRollup: RollupOption | undefined;

  ngOnInit(): void {
    if (!this.tile) return;
    if (!!this.getRollupFromLocalStorage()) {
      this.activeRollup = this.getRollupFromLocalStorage();
    }
    if (!this.activeRollup) {
      if (!!this.tile.defaultRollup)
        this.activeRollup = this.tile.defaultRollup;
      else if (!!this.tile.rollups) {
        const rollupIndex = Math.floor(this.tile.rollups.length / 2) - 1;
        this.activeRollup = this.tile?.rollups[rollupIndex];
      } else {
        this.activeRollup = {
          display: 'D',
          value: '1day',
        };
      }
    }
    if (!this.tile.parameters?.rollup) this.updateData();
  }

  private updateData() {
    if (!this.tile || !this.tile.panelId) return;
    this.store.dispatch(
      changePanelParameters({
        panelId: this.tile.panelId,
        parameter: 'rollup',
        value: this.activeRollup,
      })
    );
    this.store.dispatch(fetchPanelData({ id: this.tile.panelId }));
  }

  onRollupChangeFunc(rollup: RollupOption | undefined) {
    if (!!rollup && !!this.tile) {
      this.activeRollup = rollup;
      this.saveRollupToLocalStorage();
      this.updateData();
    }
  }

  private saveRollupToLocalStorage() {
    let storedData = this.getLocalStoredData();

    if (!!this.tile?.panelId && !!this.activeRollup) {
      const tempData = {
        panelId: this.tile.panelId,
        rollup: this.activeRollup,
      };
      const index = storedData?.findIndex(
        (r) => r.panelId === this.tile?.panelId
      );
      if (!!storedData && !!index && index > -1) {
        storedData[index] = tempData;
      } else storedData = [tempData];

      localStorage.setItem('activeRollups', JSON.stringify(storedData));
    }
  }

  private getRollupFromLocalStorage(): RollupOption | undefined {
    const storedData = this.getLocalStoredData();
    let result: RollupOption | undefined = undefined;

    if (!!storedData && !!this.tile && !!this.tile.panelId) {
      result = storedData.find((r) => r.panelId === this.tile!.panelId)?.rollup;
    }

    return result;
  }

  private getLocalStoredData(): RollupData[] | undefined {
    let storedData: RollupData[] | undefined = undefined;

    if (
      localStorage.getItem('activeRollups') != null &&
      typeof localStorage.getItem('activeRollups') == 'string'
    ) {
      storedData = JSON.parse(localStorage.getItem('activeRollups') as string);
    }

    return storedData;
  }
}

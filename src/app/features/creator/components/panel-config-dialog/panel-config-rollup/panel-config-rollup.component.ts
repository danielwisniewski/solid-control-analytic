import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { updatePanelConfig } from 'src/app/core/store/pages/panels.actions';
import {
  Panel,
  RollupOption,
} from 'src/app/features/dashboard/interfaces/panel.interface';
import { AppState } from 'src/app/state';

@Component({
  selector: 'app-panel-config-rollup',
  templateUrl: './panel-config-rollup.component.html',
  styleUrls: ['./panel-config-rollup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelConfigRollupComponent {
  @Input() set panel(value: Panel | undefined) {
    if (!!value) {
      this._panel = { ...value };
    }

    if (!!this._panel) {
      this._rollups = this._panel.rollups
        ? [...this._panel.rollups]
        : [
            { display: 'D', value: '1day' },
            { display: 'M', value: '1mo' },
          ];
    }
  }
  constructor(private store: Store<AppState>) {}
  _panel: Panel | undefined;
  _rollups: RollupOption[] | undefined;

  change() {
    if (!!this._panel) {
      this._panel = {
        ...this._panel,
        rollups: this._rollups,
      };
      this.store.dispatch(updatePanelConfig({ panel: this._panel }));
    }
  }

  changeDefaultRollup(rollup: RollupOption) {
    if (!!this._panel) {
      this._panel = {
        ...this._panel,
        defaultRollup: rollup,
      };
      console.log(this._panel);
      this.store.dispatch(updatePanelConfig({ panel: this._panel }));
    }
  }

  changeRollup(value: RollupOption, index: number) {
    if (!!this._rollups) {
      this._rollups[index] = value;
    }
    this.change();
  }

  addNewRollupOption() {
    this._rollups?.push({
      display: 'W',
      value: '1wo',
    });
    this.change();
  }

  drop(event: CdkDragDrop<RollupOption[]>) {
    if (!!this._rollups)
      moveItemInArray(this._rollups, event.previousIndex, event.currentIndex);

    this.change();
  }
}

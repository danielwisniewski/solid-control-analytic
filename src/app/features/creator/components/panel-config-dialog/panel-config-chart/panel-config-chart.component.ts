import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { updatePanelConfig } from 'src/app/core/store/pages/panels.actions';
import {
  Panel,
  PanelConfiguration,
} from 'src/app/features/dashboard/interfaces/panel.interface';
import { AppState } from 'src/app/state';

@Component({
  selector: 'app-panel-config-chart',
  templateUrl: './panel-config-chart.component.html',
  styleUrls: ['./panel-config-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelConfigChartComponent {
  @Input() set panel(value: Panel | undefined) {
    if (!!value) this._panel = { ...value };
    if (!!value?.meta) this._meta = { ...value.meta };
  }
  constructor(private store: Store<AppState>) {}
  _panel: Panel | undefined;
  _meta: PanelConfiguration | undefined;

  change() {
    if (!!this._panel) {
      this._panel = {
        ...this._panel,
        meta: this._meta,
      };
      this.store.dispatch(updatePanelConfig({ panel: this._panel }));
    }
  }
}

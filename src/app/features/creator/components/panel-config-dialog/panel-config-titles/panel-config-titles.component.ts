import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { updatePanelConfig } from 'src/app/core/store/pages/panels.actions';
import {
  Panel,
  PanelConfiguration,
} from 'src/app/features/dashboard/interfaces/panel.interface';
import { AppState } from 'src/app/state';

@Component({
  selector: 'app-panel-config-titles',
  templateUrl: './panel-config-titles.component.html',
  styleUrls: ['./panel-config-titles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelConfigTitlesComponent {
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

  changeAuto(property: keyof PanelConfiguration) {
    if (!!this._meta && !!this._meta.hasOwnProperty(property)) {
      delete this._meta[property];
    }
    this.change();
  }
}
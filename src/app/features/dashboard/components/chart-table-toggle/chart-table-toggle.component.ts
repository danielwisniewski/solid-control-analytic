import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { changePanelConfiguration } from 'src/app/core/store/pages/panels.actions';
import { AppState } from 'src/app/state';
import { Panel } from '../../interfaces/panel.interface';

@Component({
  selector: 'app-chart-table-toggle',
  templateUrl: './chart-table-toggle.component.html',
  styleUrls: ['./chart-table-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTableToggleComponent {
  @Input() tile: Panel | undefined;

  @HostBinding('class') classes = 'radio_switch ml-1';
  constructor(private store: Store<AppState>) {}

  onTypeChange(type: 'chart' | 'table') {
    if (!!this.tile && !!this.tile.panelId)
      this.store.dispatch(
        changePanelConfiguration({
          panelId: this.tile?.panelId,
          propertyName: 'type',
          value: type,
        })
      );
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { selectActivePage } from 'src/app/core/store/pages/pages.selectors';
import {
  changeActivePanelIndex,
  changePanelType,
} from 'src/app/core/store/pages/panels.actions';
import { AppState } from 'src/app/state';

@Component({
  selector: 'app-chart-table-toggle',
  templateUrl: './chart-table-toggle.component.html',
  styleUrls: ['./chart-table-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTableToggleComponent {
  @Input() tileId: number = -1;

  @HostBinding('class') classes = 'radio_switch ml-1';
  constructor(private store: Store<AppState>) {}

  tileType$: Observable<'chart' | 'table' | undefined> = this.store
    .select(selectActivePage)
    .pipe(
      map((page) =>
        page?.layout.tiles.find((tile) => tile.tile === this.tileId)
      ),
      map((tile) => tile?.type)
    );

  onTypeChange(type: 'chart' | 'table') {
    this.store.dispatch(changeActivePanelIndex({ id: this.tileId }));
    this.store.dispatch(changePanelType({ panelType: type }));
  }
}

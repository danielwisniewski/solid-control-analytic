import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, distinctUntilChanged, filter, first, tap } from 'rxjs';
import { PageState } from '../interfaces/page-config.interface';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import {
  isCreatorMode,
  selectActivePage,
} from 'src/app/core/store/pages/pages.selectors';
import { Panel } from '../interfaces/panel.interface';

@Component({
  selector: 'app-ventilation',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  constructor(private store: Store<AppState>) {}

  isCreatorMode$: Observable<boolean> = this.store.select(isCreatorMode);

  pageConfig$: Observable<PageState | undefined> = this.store
    .select(selectActivePage)
    .pipe(filter((res) => !!res));

  trackBy(index: number, item: Panel) {
    return item.tile;
  }
}

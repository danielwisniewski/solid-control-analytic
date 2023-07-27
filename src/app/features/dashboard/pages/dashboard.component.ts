import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, distinctUntilChanged, tap } from 'rxjs';
import { PageState } from '../interfaces/page-config.interface';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import {
  isCreatorMode,
  selectActivePage,
} from 'src/app/core/store/pages/pages.selectors';
import { Panel } from '../interfaces/panel.interface';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { changePanelOrder } from 'src/app/core/store/pages/panels.actions';

@Component({
  selector: 'app-ventilation',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  constructor(private store: Store<AppState>) {}

  isCreatorMode$: Observable<boolean> = this.store.select(isCreatorMode);
  private tiles: Panel[] | undefined = [];
  pageConfig$: Observable<PageState | undefined> = this.store
    .select(selectActivePage)
    .pipe(
      distinctUntilChanged(),
      tap((res) => {
        this.tiles = res?.layout.tiles;
      })
    );

  trackBy(index: number, item: Panel) {
    return item.panelId;
  }

  drop(event: CdkDragDrop<Panel[]>) {
    if (!!this.tiles) {
      const temporaryTiles: Panel[] = [...this.tiles];
      moveItemInArray(temporaryTiles, event.previousIndex, event.currentIndex);
      this.store.dispatch(changePanelOrder({ panels: [...temporaryTiles] }));
    }
  }
}

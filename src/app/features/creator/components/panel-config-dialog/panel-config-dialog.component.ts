import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, filter, map, tap } from 'rxjs';
import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';
import { CreatePageService } from '../../services/create-page.service';
import { GridColumn } from 'haystack-core';
import { Panel } from 'src/app/features/dashboard/interfaces/panel.interface';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import {
  selectActivePage,
  selectPagesState,
} from 'src/app/core/store/pages/pages.selectors';
import {
  copyPanelConfiguration,
  deletePanel,
  pastePanelConfiguration,
} from 'src/app/core/store/pages/panels.actions';

@Component({
  selector: 'app-panel-config-dialog',
  templateUrl: './panel-config-dialog.component.html',
  styleUrls: ['./panel-config-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelConfigDialogComponent implements OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tile: Panel;
    },
    private createPageService: CreatePageService,
    private store: Store<AppState>
  ) {}

  columns: GridColumn[] | undefined;

  subs: Subscription = this.store
    .select(selectActivePage)
    .pipe(
      map((res) =>
        res?.layout?.tiles?.find(
          (tile) => tile.panelId === this.data.tile.panelId
        )
      ),
      filter((res) => !!res),
      tap((res) => {
        this.panel = res;
        this.columns = res?.panelData?.getColumns();
      })
    )
    .subscribe();
  panel: Panel | undefined;

  isCopiedConfig$ = this.store.select(selectPagesState);

  onCopyConfig() {
    if (!!this.panel)
      this.store.dispatch(copyPanelConfiguration({ panel: this.panel }));
  }

  onPasteConfig() {
    this.store.dispatch(pastePanelConfiguration());
  }

  onRemovePanel() {
    if (!!this.panel?.panelId)
      this.store.dispatch(deletePanel({ id: this.panel.panelId }));
  }

  pageConfig: PageState | undefined;

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

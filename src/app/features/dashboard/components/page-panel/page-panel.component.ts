import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import {
  auditTime,
  distinctUntilChanged,
  map,
  take,
  withLatestFrom,
} from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PanelConfigDialogComponent } from 'src/app/features/creator/components/panel-config-dialog/panel-config-dialog.component';
import { PanelStoreService } from '../../store/panel.store.service';
import { Panel } from '../../interfaces/panel.interface';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import {
  selectActivePage,
  selectActivePanel,
} from 'src/app/core/store/pages/pages.selectors';
import { changeActivePanelIndex } from 'src/app/core/store/pages/panels.actions';

@Component({
  selector: 'app-page-panel',
  templateUrl: './page-panel.component.html',
  styleUrls: ['./page-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  //providers: [PanelStoreService],
})
export class PagePanelComponent {
  constructor(
    private dashboardService: DashboardService,
    private modal: MatDialog,
    //private panelStore: PanelStoreService,
    private store: Store<AppState>
  ) {}

  @Input() panel: Panel | undefined;
  @Input() height: number = 30;
  @Input() isCreatorMode: boolean = false;

  panelConfig$ = this.store.select(selectActivePage).pipe(
    map((res) =>
      res?.layout.tiles.find((tile) => tile.tile === this.panel?.tile)
    ),
    distinctUntilChanged()
  );

  onDownload() {}
  // onDownload() {
  //   if (!!this.panel?.tile)
  //     this.dashboardService
  //       .getData(
  //         this.panel.tile,
  //         { ...this.panelStore.rollupParameter$.getValue() },
  //         true
  //       )
  //       .pipe(take(1))
  //       .subscribe();
  // }

  openDialog(): void {
    if (!this.panel) return;
    this.store.dispatch(changeActivePanelIndex({ id: this.panel.tile }));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.position = {
      top: '5vh',
      left: '40vw',
    };
    dialogConfig.width = '600px';
    dialogConfig.height = '800px';
    dialogConfig.data = {
      tile: this.panel,
    };
    dialogConfig.panelClass = 'config-dialog';
    const dialogRef = this.modal.open(PanelConfigDialogComponent, dialogConfig);
  }
}

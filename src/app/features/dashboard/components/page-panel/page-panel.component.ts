import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PanelConfigDialogComponent } from 'src/app/features/creator/components/panel-config-dialog/panel-config-dialog.component';
import { Panel } from '../../interfaces/panel.interface';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import {
  changeActivePanelId,
  downloadPanelReport,
  fetchPanelData,
} from 'src/app/core/store/pages/panels.actions';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-page-panel',
  templateUrl: './page-panel.component.html',
  styleUrls: ['./page-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagePanelComponent {
  constructor(private modal: MatDialog, private store: Store<AppState>) {}

  @Input() panel: Panel | undefined;
  @Input() height: number = 30;
  @Input() isCreatorMode: boolean = false;

  configDialogSub: Subscription | undefined;

  onDownload() {
    if (!!this.panel && !!this.panel.panelId)
      this.store.dispatch(downloadPanelReport({ id: this.panel.panelId }));
  }

  ngOnInit() {
    if (
      !!this.panel &&
      !!this.panel.panelId &&
      !!this.panel.meta?.skipUpdateOnTimerangeChange
    )
      this.store.dispatch(fetchPanelData({ id: this.panel.panelId }));
  }

  openDialog(): void {
    if (!this.panel) return;
    this.store.dispatch(changeActivePanelId({ id: this.panel.panelId }));
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
      tile: { ...this.panel },
    };
    dialogConfig.panelClass = 'config-dialog';
    const dialogRef = this.modal.open(PanelConfigDialogComponent, dialogConfig);

    this.configDialogSub = dialogRef
      .afterClosed()
      .pipe(
        tap(() => this.store.dispatch(changeActivePanelId({ id: undefined })))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.configDialogSub?.unsubscribe();
  }
}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageConfigTopBarComponent } from 'src/app/features/creator/components/page-config-top-bar/page-config-top-bar.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import {
  selectActivePage,
  selectPagesState,
} from 'src/app/core/store/pages/pages.selectors';
import { isCreatorMode } from 'src/app/core/store/pages/pages.selectors';
import { savePageConfiguration } from 'src/app/core/store/pages/pages.actions';

@Component({
  selector: 'app-dashboard-top-bar',
  templateUrl: './dashboard-top-bar.component.html',
  styleUrls: ['./dashboard-top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTopBarComponent {
  constructor(private modal: MatDialog, private store: Store<AppState>) {}

  pageConfig$ = this.store.select(selectActivePage);

  isSavedRequired$ = this.store.select(selectPagesState);

  isCreatorMode$ = this.store.select(isCreatorMode);

  openDialog(): void {
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
    dialogConfig.panelClass = 'config-dialog';
    const dialogRef = this.modal.open(PageConfigTopBarComponent, dialogConfig);
  }

  onSaveConfig() {
    this.store.dispatch(savePageConfiguration());
  }
}

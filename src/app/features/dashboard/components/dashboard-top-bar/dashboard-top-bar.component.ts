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
import { map, tap, withLatestFrom } from 'rxjs';
import { selectActiveTimerange } from 'src/app/core/store/timerange/timerange.selectors';
import { setActiveTimerange } from 'src/app/core/store/timerange/timerange.actions';

@Component({
  selector: 'app-dashboard-top-bar',
  templateUrl: './dashboard-top-bar.component.html',
  styleUrls: ['./dashboard-top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTopBarComponent {
  constructor(private modal: MatDialog, private store: Store<AppState>) {}

  pageConfig$ = this.store.select(selectActivePage).pipe(
    withLatestFrom(this.store.select(selectActiveTimerange)),
    tap(([config, timerange]) => {
      if (!config?.showTimerangeSelector && !timerange)
        this.store.dispatch(setActiveTimerange({ dates: 'toSpan(today())' }));
    }),
    map(([config, timerange]) => config)
  );

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

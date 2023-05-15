import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { PageConfig } from '../../interfaces/dashboard.interface';
import { DashboardStore } from '../../store/dashboard.store';
import { Observable, filter, merge } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageConfigTopBarComponent } from 'src/app/features/creator/components/page-config-top-bar/page-config-top-bar.component';

@Component({
  selector: 'app-dashboard-top-bar',
  templateUrl: './dashboard-top-bar.component.html',
  styleUrls: ['./dashboard-top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTopBarComponent implements OnInit {
  constructor(
    private dashboardStore: DashboardStore,
    private modal: MatDialog
  ) {}
  pageConfig: Observable<PageConfig | undefined> = merge(
    this.dashboardStore.activePage$,
    this.dashboardStore.activePageByCreatorModule$
  ).pipe(filter((res) => !!res));
  @Input() isCreatorMode: boolean = false;
  ngOnInit(): void {}

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
}

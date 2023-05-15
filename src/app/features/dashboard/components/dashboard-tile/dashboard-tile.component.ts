import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Tile } from '../../interfaces/dashboard.interface';
import { take, tap } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PanelConfigDialogComponent } from 'src/app/features/creator/components/panel-config-dialog/panel-config-dialog.component';
import { HDict, HGrid } from 'haystack-core';
import { PanelStoreService } from '../../store/panel.store.service';

@Component({
  selector: 'app-dashboard-tile',
  templateUrl: './dashboard-tile.component.html',
  styleUrls: ['./dashboard-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PanelStoreService],
})
export class DashboardTileComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private modal: MatDialog,
    private panelStore: PanelStoreService
  ) {}

  @Input() tileId: number | undefined = undefined;
  @Input() tile: Tile | undefined;
  @Input() height: number = 30;
  @Input() isCreatorMode: boolean = false;

  private tileData: HGrid<HDict> | undefined;

  ngOnInit(): void {
    if (!!this.tileId) this.panelStore.setTileNumber(this.tileId);
  }

  onTypeChange(type: 'chart' | 'table') {
    if (!!this.tile?.type) this.tile.type = type;
  }

  panelConfig$ = this.panelStore.onPageChange$;

  tileData$ = this.panelStore.tileData$.pipe(
    tap((res) => (this.tileData = res))
  );

  onRollupChange(event: any) {
    this.panelStore.updateParameters({
      ...this.panelStore.rollupParameter$.getValue(),
      rollup: event,
    });
  }

  onDownload() {
    if (!!this.tileId)
      this.dashboardService
        .getData(
          this.tileId,
          { ...this.panelStore.rollupParameter$.getValue() },
          true
        )
        .pipe(take(1))
        .subscribe();
  }

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
    dialogConfig.data = {
      tile: this.tile,
      grid: this.tileData,
    };
    dialogConfig.panelClass = 'config-dialog';
    const dialogRef = this.modal.open(PanelConfigDialogComponent, dialogConfig);
  }
}

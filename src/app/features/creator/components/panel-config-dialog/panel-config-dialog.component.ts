import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, tap } from 'rxjs';
import {
  PageConfig,
  TableColumnMeta,
  Tile,
} from 'src/app/features/dashboard/interfaces/dashboard.interface';
import { DashboardStore } from 'src/app/features/dashboard/store/dashboard.store';
import { CreatePageService } from '../../services/create-page.service';
import { HGrid, HaysonDict } from 'haystack-core';

@Component({
  selector: 'app-panel-config-dialog',
  templateUrl: './panel-config-dialog.component.html',
  styleUrls: ['./panel-config-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelConfigDialogComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tile: Tile;
      grid: HGrid;
    },
    private store: DashboardStore,
    private cdr: ChangeDetectorRef,
    private createPageService: CreatePageService
  ) {}
  sub: Subscription | undefined;

  columns = this.data.grid.getColumns();

  ngOnInit(): void {
    this.sub = this.store.activeDashboard$.subscribe((res) => {
      this.pageConfig = res;
    });
  }

  changeMeta(columnName: string, metaName: string, val: any) {
    const value =
      typeof val === 'boolean' || typeof val === 'string'
        ? val
        : val.target.value;

    if (!!this.pageConfig && !!this.data.tile) {
      const tileIndex = this.pageConfig?.layout.tiles.findIndex(
        (r) => r.tile == this.data.tile?.tile
      );
      let columnMeta = this.pageConfig.layout.tiles[tileIndex].columnsMeta;
      let columnMetaName: TableColumnMeta = {};
      if (!!columnMeta) {
        columnMetaName = columnMeta[columnName];
        if (!columnMetaName?.functionInputParameters)
          columnMetaName = { ...columnMetaName, functionInputParameters: [] };
      }

      this.pageConfig.layout.tiles[tileIndex].columnsMeta = {
        ...columnMeta,
        [columnName]: {
          ...columnMetaName,
          [metaName]: value,
        },
      };

      this.store.activeTile$.next(this.data.tile.tile);
      this.store.activeDashboard$.next(this.pageConfig);
    }
  }

  change() {
    if (!!this.pageConfig && !!this.data.tile) {
      const tileIndex = this.pageConfig?.layout.tiles.findIndex(
        (r) => r.tile == this.data.tile?.tile
      );
      (this.pageConfig.layout.tiles[tileIndex] = this.data.tile),
        this.store.activeTile$.next(this.data.tile.tile);
      this.store.activeDashboard$.next(this.pageConfig);
    }
  }

  onRemovePanel() {
    if (!!this.pageConfig && !!this.data.tile) {
      const tileIndex = this.pageConfig?.layout.tiles.findIndex(
        (r) => r.tile == this.data.tile?.tile
      );
      this.pageConfig.layout.tiles.splice(tileIndex, 1);
      this.store.activeDashboard$.next(this.pageConfig);
    }
  }

  pageConfig: PageConfig | undefined;

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSave() {
    if (!!this.pageConfig)
      this.createPageService.updateConfiguration(this.pageConfig);

    this.change();
  }
}

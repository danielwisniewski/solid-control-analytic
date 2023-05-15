import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, filter, merge, tap } from 'rxjs';
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
    this.sub = merge(
      this.store.activePage$,
      this.store.activePageByCreatorModule$
    )
      .pipe(filter((res) => !!res))
      .subscribe((res) => {
        res?.layout.tiles.map((r) => {
          if (!r.columnsMeta) r.columnsMeta = [];
        });
        this.pageConfig = res;

        this.cdr.detectChanges();
      });
  }

  getIndex(metaName: string, columnName: string): number {
    return (
      this.data.tile.columnsMeta?.findIndex(
        (r) => r.columnName === columnName
      ) ?? -1
    );
  }

  changeMeta(columnName: string, metaName: string, valueFromTemplate: any) {
    let valueToProcess = valueFromTemplate;

    if (typeof valueToProcess === 'object' && !!valueToProcess.target)
      valueToProcess = valueToProcess.target.value;

    if (!!this.pageConfig && !!this.data.tile) {
      const tileIndex = this.pageConfig?.layout.tiles.findIndex(
        (r) => r.tile == this.data.tile?.tile
      );

      if (!this.pageConfig.layout.tiles[tileIndex].columnsMeta)
        this.pageConfig.layout.tiles[tileIndex].columnsMeta = [];

      let columnMetaIndex =
        this.pageConfig.layout.tiles[tileIndex].columnsMeta?.findIndex(
          (r) => r.columnName === columnName
        ) ?? -1;

      if (columnMetaIndex > -1)
        this.pageConfig.layout.tiles[tileIndex].columnsMeta![columnMetaIndex] =
          {
            ...this.pageConfig.layout.tiles[tileIndex].columnsMeta![
              columnMetaIndex
            ],
            [metaName]: valueToProcess,
          };
      else {
        this.pageConfig.layout.tiles[tileIndex].columnsMeta?.push({
          columnName: columnName,
          [metaName]: valueToProcess,
        });
      }

      this.store.activeTile$.next(this.data.tile.tile);
      this.store.activePageByCreatorModule$.next(this.pageConfig);
    }
  }

  change() {
    if (!!this.pageConfig && !!this.data.tile) {
      const tileIndex = this.pageConfig?.layout.tiles.findIndex(
        (r) => r.tile == this.data.tile?.tile
      );
      (this.pageConfig.layout.tiles[tileIndex] = this.data.tile),
        this.store.activeTile$.next(this.data.tile.tile);
      this.store.activePageByCreatorModule$.next(this.pageConfig);
    }
  }

  onRemovePanel() {
    if (!!this.pageConfig && !!this.data.tile) {
      const tileIndex = this.pageConfig?.layout.tiles.findIndex(
        (r) => r.tile == this.data.tile?.tile
      );
      this.pageConfig.layout.tiles.splice(tileIndex, 1);
      this.store.activePageByCreatorModule$.next(this.pageConfig);
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

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { PageTileMeta, Tile } from '../../interfaces/dashboard.interface';
import { DashboardStore } from '../../store/dashboard.store';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  merge,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PanelConfigDialogComponent } from 'src/app/features/creator/components/panel-config-dialog/panel-config-dialog.component';
import { HDict, HGrid } from 'haystack-core';

@Component({
  selector: 'app-dashboard-tile',
  templateUrl: './dashboard-tile.component.html',
  styleUrls: ['./dashboard-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTileComponent implements OnInit {
  constructor(
    private dashboardStore: DashboardStore,
    private dashboardService: DashboardService,
    private modal: MatDialog
  ) {}

  @Input() tile: Tile | undefined;
  @Input() height: number = 30;
  @Input() isCreatorMode: boolean = false;

  private tileParameters$ = new BehaviorSubject<any>({});

  private tileData: HGrid<HDict> | undefined;

  ngOnInit(): void {}

  onTypeChange(type: 'chart' | 'table') {
    if (!!this.tile?.type) this.tile.type = type;
  }

  dataUpdatedByPageChange$ = combineLatest([
    this.dashboardStore.dashboardConfig$,
    this.tileParameters$,
    this.dashboardStore.pageVariables$,
  ]).pipe(
    // Wait for rollup params
    filter(
      ([res, params]) =>
        (!!this.tile?.hasRollupSelector && !!params.rollup) ||
        !this.tile?.hasRollupSelector
    ),
    filter(() => !!this.tile),
    distinctUntilChanged(),
    switchMap(() => {
      return merge(
        of(undefined),
        this.dashboardService.getData(this.tile!.tile, {
          ...this.tileParameters$.getValue(),
          ...this.dashboardStore.pageVariables$.getValue(),
        })
      );
    }),
    map((res) => {
      if (!!res && this.tile?.meta) {
        const meta = this.tile?.meta as any;
        res.meta.update(meta);

        console.log(this.tile.columnsMeta);
      }
      if (!!res && this.tile?.columnsMeta) {
        for (const key in this.tile?.columnsMeta) {
          const object = this.tile?.columnsMeta[key];
          for (const meta in object) {
            res.getColumn(key)?.meta.set(meta, object[meta]);
          }
        }
      }
      this.tileData = res;
      return this.tileData?.newCopy();
    })
  );

  dataUpdatedByCreatorModule$ = combineLatest([
    this.dashboardStore.activeDashboard$,
    this.dashboardStore.activeTile$,
  ]).pipe(
    map(([res, tile]) => {
      return res?.layout.tiles.find(
        (r) => r.tile === tile && r.tile === this.tile?.tile
      );
    }),
    filter((res) => !!res?.meta),
    map((res) => res as Tile),
    map((res) => {
      if (!!res.meta && this.tileData)
        this.tileData.meta.update(res.meta as any);
      if (!!res.columnsMeta && this.tileData) {
        for (const key in res.columnsMeta) {
          const object = res.columnsMeta[key];
          for (const meta in object) {
            this.tileData.getColumn(key)?.meta.set(meta, object[meta]);
          }
        }
      }
      return this.tileData?.newCopy();
    }),
    distinctUntilChanged()
  );

  tileData$ = merge(
    this.dataUpdatedByPageChange$,
    this.dataUpdatedByCreatorModule$
  ).pipe(
    distinctUntilChanged()
    //tap((res) => console.log(res))
  );

  onRollupChange(event: any) {
    this.tileParameters$.next({
      ...this.tileParameters$.getValue(),
      rollup: event,
    });
  }

  onDownload() {
    this.dashboardService
      .getData(this.tile!.tile, { ...this.tileParameters$.getValue() }, true)
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

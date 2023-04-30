import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { DashboardState, Tile } from '../../interfaces/dashboard.interface';
import { DashboardStore } from '../../store/dashboard.store';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  merge,
  of,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-tile',
  templateUrl: './dashboard-tile.component.html',
  styleUrls: ['./dashboard-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTileComponent implements OnInit {
  constructor(
    private dashboardStore: DashboardStore,
    private dashboardService: DashboardService
  ) {}

  @Input() tile: Tile | undefined;

  private parameters$ = new BehaviorSubject<any>({});

  ngOnInit(): void {}

  onTypeChange(type: 'chart' | 'table') {
    if (!!this.tile?.type) this.tile.type = type;
  }

  dashboardData$ = combineLatest([
    this.dashboardStore.dashboardState$,
    this.parameters$,
  ]).pipe(
    filter(() => !!this.tile),
    map(([res, params]) => {
      return { dashboardState: res, params: params };
    }),
    filter(
      (res) =>
        (!!this.tile?.hasRollupSelector && !!res.params.rollup) ||
        !this.tile?.hasRollupSelector
    ),
    shareReplay(1)
  );

  tileData$ = this.dashboardData$.pipe(
    switchMap((res: { dashboardState: DashboardState; params: any }) => {
      return merge(
        of(undefined),
        this.dashboardService.getData(
          this.tile!.tile,
          res.dashboardState.skysparkFunc!,
          { ...res.params }
        )
      );
    }),
    filter((res) => !!res),
    shareReplay(1)
  );

  onRollupChange(event: any) {
    this.parameters$.next({
      ...this.parameters$.getValue(),
      rollup: event,
    });
  }

  onDownload() {
    this.dashboardData$
      .pipe(
        take(1),
        switchMap((res: { dashboardState: DashboardState; params: any }) => {
          return this.dashboardService.getData(
            this.tile!.tile,
            res.dashboardState.skysparkFunc!,
            { ...res.params },
            true
          );
        })
      )
      .subscribe();
  }
}

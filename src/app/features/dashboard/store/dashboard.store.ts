import { Injectable } from '@angular/core';
import { SiteStore } from 'src/app/core/store/site.store';
import { TimerangeStore } from 'src/app/core/store/timerange.store';
import { AppStore } from 'src/app/core/store/app.store.';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  shareReplay,
} from 'rxjs';
import { DashboardState } from '../interfaces/dashboard.interface';
import { defaultRollups } from '../constants/dashboard.constants';

@Injectable({
  providedIn: 'root',
})
export class DashboardStore {
  constructor(
    private AppStore: AppStore,
    private SiteStore: SiteStore,
    private TimerangeStore: TimerangeStore
  ) {}

  routerParam$ = new BehaviorSubject<string | undefined>(undefined);

  dashboardState$: Observable<DashboardState> = combineLatest([
    this.routerParam$,
    this.TimerangeStore.activeTimerange$,
    this.AppStore.appConfig$,
    this.SiteStore.activeSite$,
  ]).pipe(
    filter((res) => res.every((r) => !!r)),
    map(([routeParam, timerange, config, site]) => {
      const dashboardConfig = config?.dashboards?.find(
        (dashboard) => dashboard.path === routeParam
      );

      dashboardConfig?.layout.tiles.map((tile) => {
        if (tile.hasRollupSelector && typeof tile.rollups === 'undefined')
          tile.rollups = defaultRollups;
      });

      return {
        site: site,
        layout: dashboardConfig?.layout,
        skysparkFunc: dashboardConfig?.skysparkFunc,
        timerange: timerange,
        title: dashboardConfig?.title,
        datepicker: dashboardConfig?.datepicker,
      };
    }),

    filter((res) => !!res.layout && !!res.skysparkFunc && !!res.site),
    shareReplay(1)
  );
}

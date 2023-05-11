import { Injectable } from '@angular/core';
import { AppStore } from 'src/app/core/store/app.store.';
import { SiteStore } from 'src/app/core/store/site.store';
import { TimerangeStore } from 'src/app/core/store/timerange.store';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  tap,
} from 'rxjs';
import { PageConfig } from '../interfaces/dashboard.interface';
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
  detailsPageId$ = new BehaviorSubject<string | undefined>(undefined);
  activeDashboard$ = new BehaviorSubject<PageConfig | undefined>(undefined);

  pageVariables$ = new BehaviorSubject<any>(undefined);
  activeTile$ = new BehaviorSubject<number>(0);

  dashboardConfig$: Observable<PageConfig | undefined> = combineLatest([
    this.routerParam$,
    this.TimerangeStore.activeTimerange$,
    this.AppStore.appConfig$,
    this.SiteStore.activeSite$,
  ]).pipe(
    filter((res) => res.every((r) => !!r)),
    map(([activeDashboardRoute, activeTimerange, appConfig, activeSite]) => {
      // Find configuration of the dashboard based on route path
      const routeToCompare = !!this.detailsPageId$.getValue()
        ? `${activeDashboardRoute}/details`
        : activeDashboardRoute;
      const dashboardConfig = appConfig?.dashboards?.find(
        (dashboard) => dashboard.path === routeToCompare
      );

      // Assign default rollup when no set
      dashboardConfig?.layout.tiles.map((tile) => {
        if (tile.hasRollupSelector && typeof tile.rollups === 'undefined')
          tile.rollups = defaultRollups;
      });
      return dashboardConfig;
    }),
    tap((res) => this.activeDashboard$.next(res))
  );
}

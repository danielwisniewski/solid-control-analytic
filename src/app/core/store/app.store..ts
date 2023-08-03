import { Injectable } from '@angular/core';
import { RouteInfo } from '../components/sidebar/sidebar.component';
import { RequestReadService } from '../services/requests/read/request-read.service';
import {
  BehaviorSubject,
  ReplaySubject,
  filter,
  iif,
  map,
  retry,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HDict, HGrid, HStr, HaysonGrid } from 'haystack-core';

import { SiteStore } from './site.store';
import { AppConfig } from '../interfaces/AppConfig.interface';
import { Store } from '@ngrx/store';
import { changeActiveSite, updateSites } from './sites/site.actions';
import { AppState } from 'src/app/state';
import { generateRoutes } from './menu/route.actions';
import { loadPages } from './pages/pages.actions';
import { setUsername } from './user/user.actions';

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  constructor(
    private siteStore: SiteStore,
    private req: RequestReadService,
    private store: Store<AppState>
  ) {}

  fetchAppConfig(): void {
    this.req
      .about()
      .pipe(
        switchMap((res) => {
          const GRID = HGrid.make(res);
          const version: string =
            GRID.first?.get('moduleVersion')?.toString() ?? '3.0';
          localStorage.setItem('version', version);
          const username = GRID.first?.get('whoami')?.toString() ?? 'user';
          this.store.dispatch(setUsername({ username: username }));
          return this.req.readExpr('scAppConfig()');
        }),
        filter((res) => !!res && !!res.rows),
        take(1),
        map((res: HaysonGrid) => HGrid.make(res)),
        tap((GRID: HGrid) => {
          if (!GRID.first) return;

          if (!!GRID.first.has('sites')) {
            this.store.dispatch(
              updateSites({ sites: GRID.first.get<HGrid<HDict>>('sites') })
            );
          }

          if (GRID.first.has('dashboards')) {
            GRID.first.set(
              'dashboards',
              GRID.first.get<HGrid>('dashboards')!.getRows().toHayson()
            );
          }

          const config: unknown = GRID.first.toJSON() as unknown;

          const dashConfig = config as AppConfig;

          this.store.dispatch(loadPages({ pages: dashConfig.dashboards! }));
          this.store.dispatch(generateRoutes({ routeInfos: dashConfig.menu }));
        })
      )
      .subscribe();
  }

  appConfig$ = new ReplaySubject<AppConfig | undefined>(1);

  $route = new BehaviorSubject<string>('');
}

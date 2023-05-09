import { Injectable } from '@angular/core';
import { RouteInfo } from '../components/sidebar/sidebar.component';
import { RequestReadService } from '../services/requests/read/request-read.service';
import { BehaviorSubject, filter, retry, switchMap, take, tap } from 'rxjs';
import { HGrid, HaysonGrid } from 'haystack-core';

import { SiteStore } from './site.store';
import { AppConfig } from '../interfaces/AppConfig.interface';

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  constructor(private siteStore: SiteStore, private req: RequestReadService) {}

  fetchAppConfig(): void {
    this.req
      .about()
      .pipe(
        switchMap((res) => {
          const GRID = HGrid.make(res);
          const version: string =
            GRID.first?.get('moduleVersion')?.toString() ?? '3.0';
          localStorage.setItem('version', version);
          return this.req.readExpr('scAppConfig()');
        }),
        filter((res) => !!res && !!res.rows),
        retry(3),
        take(1),
        tap((res: HaysonGrid) => {
          const GRID = HGrid.make(res);

          if (!GRID.first) return;

          if (GRID.first.has('sites'))
            this.siteStore.sites$.next(GRID.first.get('sites'));

          if (GRID.first.has('dashboards')) {
            GRID.first.set(
              'dashboards',
              GRID.first.get<HGrid>('dashboards')!.getRows().toHayson()
            );
          }

          const config: unknown = GRID.first.toJSON() as unknown;

          const dashConfig = config as AppConfig;
          this.appConfig$.next(dashConfig);
          this.sidebarRoutes$.next([...dashConfig?.menu]);
        })
      )
      .subscribe();
  }

  appConfig$ = new BehaviorSubject<AppConfig | undefined>(undefined);

  sidebarRoutes$ = new BehaviorSubject<RouteInfo[]>([]);

  $route = new BehaviorSubject<string>('');
}

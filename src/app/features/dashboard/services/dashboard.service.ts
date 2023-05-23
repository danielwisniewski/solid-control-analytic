import { Injectable } from '@angular/core';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import {
  Observable,
  combineLatest,
  filter,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HGrid, HaysonGrid } from 'haystack-core';
import { SiteStore } from 'src/app/core/store/site.store';
import { TimerangeStore } from 'src/app/core/store/timerange.store';
import { DashboardStore } from '../store/dashboard.store';
import { queryToZinc } from 'src/app/core/functions/utils';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { selectActiveSiteId } from 'src/app/core/store/sites/site.selectors';
import {
  selectActivePanel,
  selectDetailsPageId,
  selectSkysparkFunc,
} from 'src/app/core/store/pages/pages.selectors';
import { selectActiveTimerange } from 'src/app/core/store/timerange/timerange.selectors';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private req: RequestReadService,
    private siteStore: SiteStore,
    private timerangeStore: TimerangeStore,
    private dashboardStore: DashboardStore,
    private store: Store<AppState>
  ) {}

  generateQuery(tile: number, parameters: any = {}): string {
    const timerange = this.timerangeStore.getActiveTimerange();
    const skysparkFunc =
      this.dashboardStore.activePage$.getValue()?.skysparkFunc;

    if (!!this.dashboardStore.detailsPageId$.getValue()) {
      parameters = {
        ...parameters,
        detailPageId: this.dashboardStore.detailsPageId$.getValue(),
      };
    }

    const jsonParameters =
      Object.keys(parameters).length > 0
        ? `, ${JSON.stringify(parameters)}`
        : '';

    return `${skysparkFunc}(${tile},${timerange},${this.siteStore.getActiveSiteId()}${jsonParameters})`;
  }

  getData(
    tile: number,
    parameters: any = {},
    isExport: boolean = false
  ): Observable<HGrid | undefined> {
    const query = this.generateQuery(tile, parameters);

    if (isExport) {
      const VIEW_NAME = 'tableReport';
      const STATE = `{ funcData: "${query}" }`;
      this.req.generateExportRequest(VIEW_NAME, STATE, 'Report');
      return of(undefined);
    }
    return this.req.readExprAll(queryToZinc(query)).pipe(
      take(1),
      map((res: HaysonGrid) => {
        const grid = HGrid.make(res);
        return grid;
      })
    );
  }

  fetchData(tile: number): Observable<HGrid | undefined> {
    return combineLatest([
      this.store.select(selectActiveSiteId),
      this.store.select(selectSkysparkFunc),
      this.store.select(selectActiveTimerange),
      this.store.select(selectActivePanel),
      this.store.select(selectDetailsPageId),
    ]).pipe(
      filter(
        ([activeSite, skysparkFunc, timerange, panel]) =>
          !!activeSite && !!skysparkFunc && !!timerange && !!panel
      ),
      map(([activeSite, skysparkFunc, timerange, panel, detailsPageId]) => {
        let parameters = panel?.parameters ?? {};

        if (!!detailsPageId)
          parameters = { ...parameters, detailsPageId: detailsPageId };

        const jsonParameters =
          Object.keys(parameters).length > 0
            ? `, ${JSON.stringify(parameters)}`
            : '';

        return `${skysparkFunc}(${tile},${timerange},${activeSite}${jsonParameters})`;
      }),
      switchMap((query) => {
        return this.req.readExprAll(queryToZinc(query)).pipe(
          take(1),
          map((res: HaysonGrid) => {
            const grid = HGrid.make(res);
            return grid;
          })
        );
      })
    );
  }
}

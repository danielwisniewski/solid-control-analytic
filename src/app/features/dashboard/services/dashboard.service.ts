import { Injectable } from '@angular/core';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { Observable, map, of, take } from 'rxjs';
import { HGrid, HaysonGrid } from 'haystack-core';
import { SiteStore } from 'src/app/core/store/site.store';
import { TimerangeStore } from 'src/app/core/store/timerange.store';
import { DashboardStore } from '../store/dashboard.store';
import { queryToZinc } from 'src/app/core/functions/utils';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private req: RequestReadService,
    private siteStore: SiteStore,
    private timerangeStore: TimerangeStore,
    private dashboardStore: DashboardStore
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
}

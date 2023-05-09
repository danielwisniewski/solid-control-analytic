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
    private SiteStore: SiteStore,
    private TimerangeStore: TimerangeStore,
    private DashboardStore: DashboardStore
  ) {}

  getData(
    tile: number,
    parameters: any = {},
    isExport: boolean = false
  ): Observable<HGrid | undefined> {
    const timerange = this.TimerangeStore.activeTimerange$.getValue();
    let skysparkFunc =
      this.DashboardStore.activeDashboard$.getValue()?.skysparkFunc;

    if (!!this.DashboardStore.detailsPageId$.getValue()) {
      parameters = {
        ...parameters,
        detailPageId: this.DashboardStore.detailsPageId$.getValue(),
      };
    }

    const jsonParameters =
      Object.keys(parameters).length > 0
        ? `, ${JSON.stringify(parameters)}`
        : '';

    const query = `${skysparkFunc}(${tile},${timerange},${this.SiteStore.getActiveSiteId()}${jsonParameters})`;

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

import { Injectable } from '@angular/core';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { queryToZinc } from '../../tmmp-config/utils/utils.functions';
import { Observable, map, switchMap, take, throttleTime } from 'rxjs';
import { HGrid, HaysonGrid } from 'haystack-core';
import { ChartConfiguration } from 'chart.js';
import { ChartGenerationService } from 'src/app/shared/charts/services/chart-generation.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';

@Injectable({
  providedIn: 'root',
})
export class VentilationService {
  constructor(
    private req: RequestReadService,
    private chartGenerationService: ChartGenerationService,
    private siteStore: SiteStoreService
  ) {}

  getData(
    timerange: string[],
    tile: number,
    type: string
  ): Observable<ChartConfiguration | undefined> {
    return this.siteStore.activeSite$.pipe(
      throttleTime(5000),
      take(1),
      switchMap((site) => {
        const query = `${type}ReportChart(${tile}, toDateSpan(${
          timerange[0]
        }..${timerange[1]}),${site?.get('id')?.toZinc(true)})`;

        return this.req.readExprAll(queryToZinc(query)).pipe(
          take(1),
          map((res: HaysonGrid) => {
            const grid = HGrid.make(res);

            return this.chartGenerationService.generateChart(grid);
          })
        );
      })
    );
  }

  getTableData(timerange: string[], type: string): Observable<HGrid> {
    const query = `${type}ReportChart(4, toDateSpan(${timerange[0]}..${
      timerange[1]
    }),${this.siteStore.activeSite$.getValue()?.get('id')?.toZinc(true)})`;
    return this.req
      .readExprAll(queryToZinc(query))
      .pipe(map((res) => HGrid.make(res)));
  }
}

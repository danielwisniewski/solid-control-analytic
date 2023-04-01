import { Injectable } from '@angular/core';
import { HaysonGrid, HGrid, HRef, HStr } from 'haystack-core';
import { Observable, take, map } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';

import {
  BaselineOptions,
  DailyProfileModeOptions,
  DailyProfileOptions,
  DaysOptions,
  NormalizationOptions,
} from '../enums/charts.enum';

@Injectable({
  providedIn: 'root',
})
export class DailyProfileLinechartService {
  constructor(private req: RequestReadService) {}

  fetchDailyProfileLinechart(
    meterId: HRef | undefined,
    normalizationOptions: NormalizationOptions[],
    baseline: BaselineOptions = BaselineOptions.energyBaselinePrevMonth,
    days: DaysOptions = DaysOptions.all,
    mode: DailyProfileModeOptions = DailyProfileModeOptions.dailyAverage,
    includeSubmeters: boolean = false
  ): Observable<HGrid> {
    const EXPR_TO_SEND = this.generateRequestExpression(
      meterId,
      normalizationOptions,
      baseline,
      days,
      mode,
      includeSubmeters
    );

    return this.req.readExprAll(EXPR_TO_SEND).pipe(
      take(1),
      map((res: HaysonGrid) => HGrid.make(res))
    );
  }

  private generateRequestExpression(
    meterId: HRef | undefined,
    normalizationOptions: NormalizationOptions[],
    baseline: BaselineOptions,
    days: DaysOptions,
    mode: DailyProfileModeOptions,
    includeSubmeters: boolean
  ): string {
    const meterIdZinc = meterId?.toZinc(true);

    const DailyProfileReqOptions: DailyProfileOptions = {
      days: days,
      mode: mode,
      norms: normalizationOptions,
      point: 'equipRef->elec and power and sensor',
      includeSubmeters: includeSubmeters,
      rollup: {
        fold: 'max',
        interval: '15min',
      },
      baseline: baseline,
    };

    const DailyProfileReqOptionsString = JSON.stringify(DailyProfileReqOptions);

    const Expression = `energyProfile(${meterIdZinc}, toSpan(thisMonth), ${DailyProfileReqOptionsString}).renameCol("time", "ts")`;

    return HStr.make(Expression).toZinc();
  }
}

import { Injectable } from '@angular/core';

import { HaysonGrid, HGrid, HRef, HStr } from 'haystack-core';
import { Observable, take, map } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { TimerangeOption } from 'src/app/core/store/timerange-store.service';

import {
  NormalizationOptions,
  BaselineOptions,
  EnergyUsageModeOptions,
  EnergyUsageOptions,
} from '../enums/charts.enum';

@Injectable({
  providedIn: 'root',
})
export class EnergyUsageChartService {
  constructor(private req: RequestReadService) {}

  private generateRequestExpression(
    siteId: HRef,
    meterType: string,
    activeTimerange: TimerangeOption,
    normalizationOptions: NormalizationOptions[],
    baseline: BaselineOptions,
    category: boolean
  ): string {
    if (!siteId) return '';

    let siteIdZinc = siteId?.toZinc(true);

    if (siteIdZinc.startsWith('@p'))
      siteIdZinc = `navRef("equip", readById(${siteIdZinc}))`;

    const EnergyUsageReqOptions: EnergyUsageOptions = {
      mode: category
        ? EnergyUsageModeOptions.donut
        : EnergyUsageModeOptions.barChart,
      norms: normalizationOptions,
      point: meterType,
      rollup: {
        fold: 'sum',
        interval: category ? '*' : 'auto',
      },
      baseline: baseline,
    };

    const energyUsageReqOptionsString = JSON.stringify(EnergyUsageReqOptions);

    const Expression = category
      ? `energyUsage([${siteIdZinc}], toSpan(${activeTimerange.value}), ${energyUsageReqOptionsString})`
      : `energyUsage([${siteIdZinc}], toSpan(${activeTimerange.value}), ${energyUsageReqOptionsString}).renameCol("site", "ts").hisRollup(sum, ${activeTimerange.rollup})`;

    return HStr.make(Expression).toZinc();
  }

  /**
   * Function that generates site meter usage data like Skyspark "Usage" tab in "EnergyApp".
   * @param siteId Id of the site which usage data we want to generate
   * @param meterType Query that is looking points accordingly to selected meter type
   * @param activeTimerange Timerange in which the return data must fit
   * @param normalizationOptions Normalization used on usage calculation
   * @param baseline If selected the baseline data will be generated in "v0" columns
   * @returns HGrid with first column "ts" containing timestamps and data next columns with <HNum> data.
   */
  fetchEnergyUsageData(
    siteId: HRef,
    meterType: string,
    activeTimerange: TimerangeOption,
    normalizationOptions: NormalizationOptions[] = [],
    baseline: BaselineOptions = BaselineOptions.none,
    category: boolean = false
  ): Observable<HGrid> {
    const EXPR_TO_SEND = this.generateRequestExpression(
      siteId,
      meterType,
      activeTimerange,
      normalizationOptions,
      baseline,
      category
    );
    return this.req.readExprAll(EXPR_TO_SEND).pipe(
      take(1),
      map((res: HaysonGrid) => HGrid.make(res))
    );
  }
}

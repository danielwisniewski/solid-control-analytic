import { Injectable } from '@angular/core';
import { HGrid, HRef, HSpan, HStr, SpanMode } from 'haystack-core';
import { combineLatest, map, mergeMap, Observable, tap } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';
import { TimerangeStoreService } from 'src/app/core/store/timerange-store.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  constructor(
    private req: RequestReadService,
    private siteStore: SiteStoreService,
    private timerangeStore: TimerangeStoreService
  ) {}

  // getSiteMeters() {
  //   return combineLatest([
  //     this.siteStore.activeSite$,
  //     this.timerangeStore.activeTimerange$,
  //   ]).pipe(
  //     mergeMap(([site, timerange]) => {
  //       return this.req.readExpr(
  //         `scGetSiteMeters(${site.get('id')?.toZinc(true)}, ${
  //           timerange.value
  //         }, ${timerange.rollup})`
  //       );
  //     })
  //   );
  // }

  // getTrend(id: string): Observable<HGrid> {
  //   const tr = this.timerangeStore.activeTimerange$.getValue();
  //   return this.req
  //     .readExpr(
  //       `read((energy or volume or water) and equipRef->id==${id}).hisRead(${tr.value}).hisRollup(sum, ${tr.rollup})`
  //     )
  //     .pipe(map((r) => HGrid.make(r)));
  // }

  // getProfile(meterId: HRef) {
  //   const id = meterId.toZinc(true);

  //   const expr = `energyProfile(${id}, toSpan("today"), {days:"all", mode:"dailyAverage", norms:[], point:"equipRef->elec and power and sensor", includeSubmeters:false, rollup:{fold:"auto", interval:"auto"}, baseline:"energyBaselinePrevMonth"})`;
  //   console.log(HStr.make(expr).toZinc());
  //   this.req
  //     .readExprAll(HStr.make(expr).toZinc())
  //     .pipe(tap((r) => console.log(r)))
  //     .subscribe();
  // }
}

import { Injectable } from '@angular/core';
import { HDict, HRef, HaysonDict, HaysonGrid } from 'haystack-core';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { queryToZinc } from '../utils/utils.functions';
import { SiteStoreService } from 'src/app/core/store/site-store.service';

@Injectable({
  providedIn: 'root',
})
export class MeterAssignmentService {
  constructor(
    private req: RequestReadService,
    private siteStore: SiteStoreService
  ) {}

  getMeterData(id: string): Observable<HaysonDict | undefined> {
    const idRef = HRef.make(`@${id}`);
    return this.req.readById(idRef).pipe(
      filter((val: HaysonGrid) => {
        if (val.rows && val.rows.length) return true;
        else return false;
      }),
      map((val: HaysonGrid) => {
        if (val.rows) return val.rows[0];
        else return undefined;
      }),
      filter((val) => typeof val !== 'undefined')
    );
  }

  getAssignedMeters(id: string): Observable<HaysonGrid> {
    const idRef = `@${id}`;
    const query = `readAll(meter and costCenterMeterRef->id==${idRef})`;
    return this.req.readExprAll(queryToZinc(query));
  }

  getMetersList() {
    return this.siteStore.activeSite$.pipe(
      tap((res) => console.log(res)),
      filter((site) => !!site && !!site.get('id')),
      map((site) => site?.get('id')?.toZinc(true)),
      switchMap((siteId) => {
        const query = `readAll(meter and elec and siteRef->id==${siteId})`;
        return this.req.readExprAll(queryToZinc(query));
      })
    );
  }

  assignMeter(mainMeterId: string, submeter: HaysonDict) {
    const submeterId = HDict.make(submeter).get('id')?.toZinc(true);
    const mainId = `@${mainMeterId}`;

    this.req;
  }
}

import { Injectable } from '@angular/core';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { combineLatest, map, switchMap } from 'rxjs';
import { HGrid } from 'haystack-core';
import { queryToZinc } from 'src/app/core/functions/utils';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { selectActiveSiteId } from 'src/app/core/store/sites/site.selectors';
import { selectSkysparkFunc } from 'src/app/core/store/pages/pages.selectors';
import { selectActiveTimerange } from 'src/app/core/store/timerange/timerange.selectors';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private req: RequestReadService,
    private store: Store<AppState>
  ) {}

  fetchParametersOptions() {
    return combineLatest([
      this.store.select(selectActiveSiteId),
      this.store.select(selectSkysparkFunc),
      this.store.select(selectActiveTimerange),
    ]).pipe(
      map(([activeSite, skysparkFunc, timerange]) => {
        return `${skysparkFunc}(0, ${timerange}, ${activeSite}, {})`;
      }),
      switchMap((query) => this.req.readExprAll(queryToZinc(query))),
      map((res) => HGrid.make(res)),
      map((res) => res.getRows().toHayson())
    );
  }
}

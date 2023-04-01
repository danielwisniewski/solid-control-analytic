import { Injectable } from '@angular/core';
import { HaysonGrid, HDict, HGrid, HRef } from 'haystack-core';
import {
  BehaviorSubject,
  defer,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { AuthService } from '../auth/auth-service.service';
import { RequestReadService } from '../services/requests/read/request-read.service';

@Injectable({
  providedIn: 'root',
})
export class SiteStoreService {
  constructor(
    private req: RequestReadService,
    private authService: AuthService
  ) {
    this.authService.userLoggedIn$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((loggedIn) => {
        if (!loggedIn) {
          this.clearSitesData();
        } else {
          this.fetchSitesData();
        }
      });
  }
  private readonly onDestroy$ = new Subject<void>();
  private sitesData: HGrid<HDict> | undefined;
  activeSite$ = new BehaviorSubject<HDict | undefined>(undefined);

  sitesData$: Observable<HGrid<HDict>> = defer(() => {
    if (this.sitesData) {
      return of(this.sitesData);
    } else {
      return this.fetchSitesData();
    }
  });

  private fetchSitesData(): Observable<HGrid<HDict>> {
    return this.req.readByFilter('site').pipe(
      switchMap((res: HaysonGrid) => {
        const sitesGrid = HGrid.make(res);
        if (sitesGrid.first) {
          this.activeSite$.next(sitesGrid.first);
        }
        this.sitesData = sitesGrid; // cache the fetched data
        return of(sitesGrid);
      })
    );
  }

  private clearSitesData(): void {
    this.sitesData = undefined;
    this.activeSite$.next(HDict.make({}));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

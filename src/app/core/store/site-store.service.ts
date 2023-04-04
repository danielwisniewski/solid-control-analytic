import { Injectable } from '@angular/core';
import { HaysonGrid, HDict, HGrid } from 'haystack-core';
import {
  BehaviorSubject,
  defer,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
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

    this.activeSite$
      .pipe(
        tap((value: HDict | undefined) => {
          console.log(typeof value !== 'undefined');
          if (typeof value !== 'undefined')
            localStorage.setItem('site', JSON.stringify(value.toJSON()));
        })
      )
      .subscribe();
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
    if (localStorage.getItem('site') && localStorage.getItem('site') !== '') {
      this.activeSite$.next(
        HDict.make(JSON.parse(localStorage.getItem('site')!))
      );
    }
    return this.req.readByFilter('site').pipe(
      switchMap((res: HaysonGrid) => {
        const sitesGrid = HGrid.make(res);
        if (sitesGrid.first && localStorage.getItem('site') == '') {
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
    localStorage.setItem('site', '');
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

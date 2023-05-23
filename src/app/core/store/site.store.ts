import { Injectable } from '@angular/core';
import { HDict, HGrid } from 'haystack-core';
import { BehaviorSubject, filter, retry, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SiteStore {
  constructor() {
    this.sites$
      .pipe(
        filter((val) => !!val),
        filter((val) => !val?.isEmpty()),
        take(1),
        tap((sites: HGrid<HDict> | undefined) => {
          if (!!localStorage.getItem('site'))
            this.activeSite$.next(
              HDict.make(JSON.parse(localStorage.getItem('site') as string))
            );
          else if (!!sites && !!sites.first) {
            this.changeActiveSite(sites.first);
          }
        })
      )
      .subscribe();
  }

  sites$ = new BehaviorSubject<HGrid<HDict> | undefined>(undefined);

  activeSite$ = new BehaviorSubject<HDict | undefined>(undefined);

  getActiveSiteId(): string {
    return this.activeSite$.getValue()?.get('id')?.toZinc(true) ?? '';
  }

  changeActiveSite(site: HDict): void {
    localStorage.setItem('site', JSON.stringify(site.toJSON()));
    this.activeSite$.next(site);
  }
}

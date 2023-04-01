import { Injectable } from '@angular/core';
import { HDict, HGrid, HRef } from 'haystack-core';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
} from 'rxjs';
import { EquipStoreService } from 'src/app/core/store/equip-store.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';

@Injectable({
  providedIn: 'root',
})
export class SitePageService {
  constructor(
    private siteStore: SiteStoreService,
    private equipStore: EquipStoreService
  ) {}

  // siteMeters$: Observable<HGrid<HDict>> = combineLatest([
  //   this.siteStore.activeSite$.asObservable(),
  //   this.equipStore.equipData$,
  // ]).pipe(
  //   map(([site, equips]) => {
  //     if (site.toDis() === 'Portfolio') return null;

  //     const siteId = site.get<HRef>('id');

  //     const meters: HGrid<HDict> = equips.filter(
  //       (row: HDict): boolean => row.has('siteMeter') && row.has('equip')
  //     );

  //     return meters.filter((row: HDict): boolean => {
  //       if (row.has('siteRef')) {
  //         const siteRef = row.get('siteRef');
  //         return siteRef!.equals(siteId);
  //       } else return false;
  //     });
  //   }),
  //   filter((meter) => !!meter),
  //   filter((meter) => !meter!.isEmpty()),
  //   map((meter) => meter as HGrid<HDict>),
  //   distinctUntilChanged()
  // );
}

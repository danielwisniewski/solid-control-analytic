import { Injectable } from '@angular/core';
import { HDict, HGrid, HRef } from 'haystack-core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { EquipStoreService } from 'src/app/core/store/equip-store.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';

@Injectable({
  providedIn: 'root',
})
export class MetersStoreService {
  activeMeterType$ = new BehaviorSubject<HDict | undefined>(undefined);
  constructor(
    private equipStore: EquipStoreService,
    private siteStore: SiteStoreService
  ) {}

  getMetersTypes(): Observable<HDict[] | undefined> {
    return combineLatest([
      this.siteStore.activeSite$,
      this.equipStore.equipData$,
    ]).pipe(
      map(([site, equips]) => {
        const id: HRef | undefined = site?.get<HRef>('id');

        let metersTypes: HDict[] = [];

        const meters = equips.filter((row: HDict): boolean => row.has('meter'));

        equips = meters.filter((row: HDict): boolean => {
          if (row.has('siteRef')) {
            const siteRef = row.get('siteRef');
            return siteRef!.equals(id);
          } else return false;
        });

        if (equips.hasColumn('elec'))
          metersTypes.push(HDict.make({ dis: 'Elektryczne', tag: 'elec' }));
        if (equips.hasColumn('water'))
          metersTypes.push(HDict.make({ dis: 'Wodomierze', tag: 'water' }));
        if (equips.hasColumn('heat'))
          metersTypes.push(HDict.make({ dis: 'Ciepłomierze', tag: 'heat' }));
        if (equips.hasColumn('naturalGas'))
          metersTypes.push(
            HDict.make({ dis: 'Gazomierze', tag: 'naturalGas' })
          );

        this.activeMeterType$.next(metersTypes[0]);
        this.getMetersList();
        return metersTypes;
      })
    );
  }

  getMetersList(): Observable<HGrid | undefined> {
    return combineLatest([
      this.siteStore.activeSite$,
      this.equipStore.equipData$,
      this.activeMeterType$,
    ]).pipe(
      map(([site, equips, meterType]) => {
        const id: HRef = site?.get<HRef>('id')!;

        const meters = equips.filter((row: HDict): boolean => row.has('meter'));

        const metersInSite = meters.filter((row: HDict): boolean => {
          if (row.has('siteRef')) {
            const siteRef = row.get('siteRef');
            return siteRef!.equals(id);
          } else return false;
        });

        const meterTypeTag = meterType?.get('tag')?.toString() || 'elec';

        return metersInSite.filter((row: HDict): boolean =>
          row.has(meterTypeTag)
        );
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HaysonGrid, HDict, HGrid, HRef } from 'haystack-core';
import {
  BehaviorSubject,
  combineLatest,
  defer,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { AuthService } from '../auth/auth-service.service';
import { METER_TYPE } from '../constants/meters.const';
import { RequestReadService } from '../services/requests/read/request-read.service';
import { SiteStoreService } from './site-store.service';

@Injectable({
  providedIn: 'root',
})
export class EquipStoreService {
  constructor(
    private req: RequestReadService,
    private authService: AuthService,
    private siteStore: SiteStoreService
  ) {
    this.authService.userLoggedIn$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((loggedIn) => {
        if (!loggedIn) {
          this.clearEquipsData();
        } else {
          this.fetchEquipsData();
        }
      });

    combineLatest([this.siteStore.activeSite$, this.equipData$])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([site, equips]) => {
        if (!site) return;
        if (site.toDis() === 'Portfolio') return;

        const SITE_ID = site.get<HRef>('id');

        if (!equips) return;
        const METERS = equips.filter(
          (row: HDict): boolean => row.has('siteMeter') && row.has('equip')
        );

        const SITE_METERS = METERS.filter((row: HDict): boolean => {
          if (row.has('siteRef')) {
            const siteRef = row.get('siteRef');
            return siteRef!.equals(SITE_ID);
          } else return false;
        });

        const ELEC_SITE_METER: HDict | undefined = SITE_METERS.filter(
          (row: HDict) => row.has(METER_TYPE.elecMeter.meterTypeTag)
        ).first;
        const WATER_SITE_METER: HDict | undefined = SITE_METERS.filter(
          (row: HDict) => row.has(METER_TYPE.waterMeter.meterTypeTag)
        ).first;
        const GAS_SITE_METER: HDict | undefined = SITE_METERS.filter(
          (row: HDict) => row.has(METER_TYPE.gasMeter.meterTypeTag)
        ).first;
        const HEAT_SITE_METER: HDict | undefined = SITE_METERS.filter(
          (row: HDict) => row.has(METER_TYPE.heatMeter.meterTypeTag)
        ).first;

        this.elecSiteMeter$.next(ELEC_SITE_METER);
        this.waterSiteMeter$.next(WATER_SITE_METER);
        this.gasSiteMeter$.next(GAS_SITE_METER);
        this.heatSiteMeter$.next(HEAT_SITE_METER);
      });
  }

  elecSiteMeter$ = new BehaviorSubject<HDict | undefined>(undefined);
  waterSiteMeter$ = new BehaviorSubject<HDict | undefined>(undefined);
  gasSiteMeter$ = new BehaviorSubject<HDict | undefined>(undefined);
  heatSiteMeter$ = new BehaviorSubject<HDict | undefined>(undefined);

  private readonly onDestroy$ = new Subject<void>();
  private equipsData$: Observable<HGrid<HDict>> | undefined;

  equipData$: Observable<HGrid<HDict>> = defer(() => {
    if (!this.equipsData$) {
      this.equipsData$ = this.fetchEquipsData().pipe(shareReplay(1));
    }
    return this.equipsData$;
  });

  private fetchEquipsData(): Observable<HGrid<HDict>> {
    return this.req.readByFilter('equip').pipe(
      switchMap((res: HaysonGrid) => {
        const equipsGrid = HGrid.make(res);
        return of(equipsGrid);
      })
    );
  }

  private clearEquipsData(): void {
    this.equipsData$ = undefined;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

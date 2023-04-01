import { Component } from '@angular/core';
import { SelectionType } from '@swimlane/ngx-datatable';
import { HGrid } from 'haystack-core';
import { distinctUntilChanged, filter, startWith, switchMap } from 'rxjs';
import { finalize } from 'rxjs';
import { mergeMap } from 'rxjs';
import { combineLatest } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs';

import { Observable } from 'rxjs';

import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';

import config from '../../../../assets/configs/meters-list/meters.config.json';
import { queryToZinc, sortByStoreNum } from '../utils/utils.functions';

@Component({
  selector: 'app-tmmp-config',
  templateUrl: './tmmp-config.component.html',
  styleUrls: ['./tmmp-config.component.scss'],
})
export class TmmpConfigComponent {
  constructor(
    private siteService: SiteStoreService,
    private req: RequestReadService
  ) {}

  config: any = config;

  queryTotal: any = new Function(
    config.configuration.totalMeters.query.arguments,
    config.configuration.totalMeters.query.body
  );

  queryMeters: any = new Function(
    config.configuration.meters.query.arguments,
    config.configuration.meters.query.body
  );

  displayCheckTotal: any =
    new Function(
      config.configuration.totalMeters.displayCheck.arguments,
      config.configuration.totalMeters.displayCheck.body
    ) || true;

  displayCheckMeters: any =
    new Function(
      config.configuration.meters.displayCheck.arguments,
      config.configuration.meters.displayCheck.body
    ) || true;

  displayCheckMetersActive: any =
    new Function(
      config.configuration.meters.displayCheckActive.arguments,
      config.configuration.meters.displayCheckActive.body
    ) || true;

  selectTypeMeters: SelectionType = SelectionType.multi;

  costCenterMeters$: Observable<any[] | undefined> =
    this.siteService.activeSite$.pipe(
      filter((site) => !!site && !!site.get('id')),
      map((site) => site?.get('id')?.toZinc(true)),
      distinctUntilChanged(),
      switchMap((value) => {
        return this.req.readByFilter(this.queryTotal(value)).pipe(
          map((res) => HGrid.make(res).toJSON().rows),
          map((rows) => rows?.sort(sortByStoreNum) ?? []),
          startWith([])
        );
      })
    );

  activeTotalMeter = new BehaviorSubject<string | undefined>(undefined);

  metersRows$: Observable<any[] | undefined> = combineLatest([
    this.siteService.activeSite$.asObservable(),
    this.activeTotalMeter,
  ]).pipe(
    filter(([activeSite, activeMeter]) => !!activeSite),
    map(([site, meter]) => [site?.get('id')?.toZinc(true), meter]),
    mergeMap(([activeSite, activeMeter]) => {
      return this.req.readByFilter(this.queryMeters(activeSite)).pipe(
        map((row) => {
          const GRID = HGrid.make(row);
          if (typeof activeMeter === 'undefined') {
            this.selectedMeters =
              GRID.filter((r) => r.has('costCenterMeterRef')).toJSON().rows ??
              [];
            return GRID.sortBy('navName').toJSON().rows;
          } else {
            this.selectedMeters =
              GRID.filter(
                (r) =>
                  r.get('costCenterMeterRef')?.toZinc(true) == `@${activeMeter}`
              ).toJSON().rows || [];
            return GRID.filter((r) => {
              return (
                !r.has('costCenterMeterRef') ||
                r.get('costCenterMeterRef')?.toZinc(true) == `@${activeMeter}`
              );
            })
              .sortBy('navName')
              .toJSON().rows;
          }
        })
      );
    })
  );

  selectedMeters: any[] = [];

  onSelect(value: any) {
    if (this.activeTotalMeter.getValue() === undefined) {
      this.activeTotalMeter.next(value.id.val);
    } else if (this.activeTotalMeter.getValue() === value.id.val)
      this.activeTotalMeter.next(undefined);
  }

  onMeterSelect(value: any) {
    if (value.hasOwnProperty('costCenterMeterRef')) {
      const query = `readById(@${value.id.val}).set("costCenterMeterRef", {-x} -> x).recEdit`;
      this.req
        .readExprAll(queryToZinc(query))
        .pipe(
          finalize(() =>
            this.activeTotalMeter.next(this.activeTotalMeter.getValue())
          )
        )
        .subscribe();
    }
    const ACTIVE_TOTAL = this.activeTotalMeter.getValue();
    if (typeof ACTIVE_TOTAL !== 'undefined') {
      const query = `readById(@${value.id.val}).set("costCenterMeterRef", parseRef("${ACTIVE_TOTAL}")).recEdit`;
      this.req
        .readExprAll(queryToZinc(query))
        .pipe(
          finalize(() =>
            this.activeTotalMeter.next(this.activeTotalMeter.getValue())
          )
        )
        .subscribe();
    }
  }
}

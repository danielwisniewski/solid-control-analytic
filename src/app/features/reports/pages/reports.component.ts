import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { BehaviorSubject, Observable, combineLatest, switchMap } from 'rxjs';
import { ReportService } from '../services/report.service';
import { HGrid } from 'haystack-core';
import { TimerangeStore } from 'src/app/core/store/timerange.store';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  constructor(
    private service: ReportService,
    private TimerangeStore: TimerangeStore
  ) {}

  activeRollup = new BehaviorSubject<'15min' | '1hr' | '1day' | '1mo'>('1day');

  table1$: Observable<HGrid> = combineLatest([
    this.TimerangeStore.activeTimerange$,
    this.activeRollup,
  ]).pipe(
    switchMap(([timerange, rollup]) => {
      return this.service.generateReport(timerange, `costCenterReport`, rollup);
    })
  );
}

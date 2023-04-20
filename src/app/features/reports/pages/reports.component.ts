import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { BehaviorSubject, Observable, combineLatest, switchMap } from 'rxjs';
import { ReportService } from '../services/report.service';
import { HGrid } from 'haystack-core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  constructor(private service: ReportService) {}

  activeRollup = new BehaviorSubject<'15min' | '1hr' | '1day' | '1mo'>('1day');

  timerange = new BehaviorSubject<string[]>([
    DateTime.local()
      .minus({ days: 7 })
      .startOf('day')
      .toFormat('yyyy-MM-dd')
      .toString(),
    DateTime.local().toFormat('yyyy-MM-dd').toString(),
  ]);

  table1$: Observable<HGrid> = combineLatest([
    this.timerange,
    this.activeRollup,
  ]).pipe(
    switchMap(([timerange, rollup]) => {
      return this.service.generateReport(timerange, `costCenterReport`, rollup);
    })
  );

  ngOnInit(): void {}

  onTimerangeChange(range: string[]) {
    this.timerange.next(range);
  }
}

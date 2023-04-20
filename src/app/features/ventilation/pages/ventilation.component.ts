import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { VentilationService } from '../services/ventilation.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  take,
  throttleTime,
} from 'rxjs';
import { ChartConfiguration } from 'chart.js';
import { HGrid } from 'haystack-core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ventilation',
  templateUrl: './ventilation.component.html',
  styleUrls: ['./ventilation.component.scss'],
})
export class VentilationComponent implements OnInit {
  constructor(
    private ventService: VentilationService,
    private route: ActivatedRoute
  ) {}

  private paramsSubscription: Subscription = this.route.params.subscribe(
    (params: any) => {
      this.dashboard = params.type;
      this.timerange.next(this.timerange.getValue());
    }
  );

  dashboardLayout: number = 1;

  ngOnInit(): void {}
  dashboard: string = this.route.snapshot.url[0].path;

  timerange = new BehaviorSubject<string[]>([
    DateTime.local()
      .minus({ days: 7 })
      .startOf('day')
      .toFormat('yyyy-MM-dd')
      .toString(),
    DateTime.local().toFormat('yyyy-MM-dd').toString(),
  ]);

  onTimerangeChange(range: string[]) {
    this.timerange.next(range);
  }

  chart1$: Observable<ChartConfiguration | undefined> = this.timerange.pipe(
    switchMap((timerange) => {
      return this.ventService.getData(timerange, 1, this.dashboard);
    })
  );

  chart2$: Observable<ChartConfiguration | undefined> = this.timerange.pipe(
    switchMap((timerange) => {
      return this.ventService.getData(timerange, 2, this.dashboard);
    })
  );

  chart3$: Observable<ChartConfiguration | undefined> = this.timerange.pipe(
    switchMap((timerange) => {
      return this.ventService.getData(timerange, 3, this.dashboard);
    })
  );

  chart4$: Observable<ChartConfiguration | undefined> = this.timerange.pipe(
    switchMap((timerange) => {
      return this.ventService.getData(timerange, 5, this.dashboard);
    })
  );

  chart5$: Observable<ChartConfiguration | undefined> = this.timerange.pipe(
    switchMap((timerange) => {
      return this.ventService.getData(timerange, 6, this.dashboard);
    })
  );

  table1$: Observable<HGrid> = this.timerange.pipe(
    switchMap((timerange) => {
      return this.ventService.getTableData(timerange, this.dashboard);
    })
  );

  getTitle(): string {
    switch (this.dashboard) {
      case 'ventilation':
        return 'Wentylacja';
      case 'production':
        return 'Działy produkcyjne';
      case 'nonProduction':
        return 'Działy nieprodukcyjne';
      case 'indirectProduction':
        return 'Działy pośrednio produkcyjne';
      case 'gasStations':
        return 'Stacje gazowe';
      case 'generalLoad':
        return 'Cele ogólne';
      default:
        return 'Dashboard';
    }
  }

  getDashboardLayout(): number {
    if (this.dashboard === 'production') return 2;
    else return 1;
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}

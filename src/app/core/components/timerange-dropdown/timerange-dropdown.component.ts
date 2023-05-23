import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  BsDatepickerConfig,
  BsDaterangepickerConfig,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';

import { DateTime, DateTimeFormatOptions } from 'luxon';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { plLocale } from 'ngx-bootstrap/locale';
import { TimerangeStore } from 'src/app/core/store/timerange.store';
import {
  Observable,
  combineLatest,
  filter,
  map,
  tap,
  withLatestFrom,
} from 'rxjs';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import {
  selectActiveTimerange,
  selectTimerangeConfiguration,
} from '../../store/timerange/timerange.selectors';
import { setActiveTimerange } from '../../store/timerange/timerange.actions';
import { fetchPanelsData } from '../../store/pages/pages.actions';

@Component({
  selector: 'app-timerange-dropdown',
  templateUrl: './timerange-dropdown.component.html',
  styleUrls: ['./timerange-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerangeDropdownComponent implements OnInit {
  constructor(
    private localeService: BsLocaleService,
    private TimerangeStore: TimerangeStore,
    private store: Store<AppState>
  ) {}

  @Input() parameters: any = {};
  type$ = combineLatest(
    this.store.select(selectTimerangeConfiguration),
    this.store.select(selectActiveTimerange)
  )
    .pipe(filter(([config, timerange]) => !!config && !!timerange))
    .subscribe(([config, timerange]) => {
      this.type = config?.type ?? 'range';
      this.parameters = config?.parameters;

      if (config?.type === 'single' && timerange.startsWith('toDateSpan')) {
        const generatedDates = this.generateSpan(new Date());

        this.store.dispatch(
          setActiveTimerange({
            dates: generatedDates,
          })
        );
      } else if (config?.type === 'range' && timerange.startsWith('toSpan')) {
        const generatedDates = this.generateDateSpan([
          DateTime.local().startOf('week').toJSDate(),
          new Date(),
        ]);

        this.store.dispatch(setActiveTimerange({ dates: generatedDates }));
      }
    });

  type: string = 'range';

  bsRangeValue: Observable<Date[]> = this.store
    .select(selectActiveTimerange)
    .pipe(
      map((res) => {
        if (this.type === 'range') {
          const date = res
            .replace('toDateSpan(', '')
            .replace(')', '')
            .split('..');

          return [new Date(date[0]), new Date(date[1])];
        } else return [new Date()];
      })
    );

  bsValue: Observable<Date[]> = this.store.select(selectActiveTimerange).pipe(
    map((res) => {
      if (this.type === 'single') {
        const date = res.replace('toSpan(', '').replace(')', '');
        return [new Date(date[0])];
      } else return [new Date()];
    })
  );

  bsDateRangeConfig: BsDaterangepickerConfig = new BsDaterangepickerConfig();

  bsDateConfig: BsDatepickerConfig = new BsDatepickerConfig();

  ngOnInit(): void {
    this.store.dispatch(setActiveTimerange({ dates: '' }));
    this.store.dispatch(fetchPanelsData());

    this.localeService.use('pl');
    defineLocale('pl', plLocale);

    this.bsDateRangeConfig = {
      ...this.bsDateRangeConfig,
      adaptivePosition: true,
      ranges: this.TimerangeStore.ranges,
      preventChangeToNextMonth: true,
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MM-YYYY',
      maxDate: new Date(),
      showPreviousMonth: true,
      customTodayClass: 'bg-info',
      ...this.parameters,
    };

    this.bsDateConfig = {
      ...this.bsDateConfig,
      adaptivePosition: true,
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MM-YYYY',
      maxDate: new Date(),
      ...this.parameters,
    };
  }

  onHidden(event: any) {
    let result: string = '';
    if (this.type === 'range') {
      result = this.generateDateSpan(event);
    } else if (this.type === 'single') {
      result = this.generateSpan(event);
    }

    if (!result) return;

    this.store.dispatch(setActiveTimerange({ dates: result }));
  }

  displayText$: Observable<string> = this.store
    .select(selectActiveTimerange)
    .pipe(
      filter((val) => typeof val !== 'undefined'),
      map((values) => {
        const format: DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        if (this.type === 'range') {
          const dates: string[] = values
            .replace('toDateSpan(', '')
            .replace(')', '')
            .split('..');
          const start = DateTime.fromJSDate(new Date(dates[0])).toLocaleString(
            format
          );
          const end = DateTime.fromJSDate(new Date(dates[1])).toLocaleString(
            format
          );

          return `${start} - ${end}`;
        } else {
          const date = values.replace('toSpan(', '').replace(')', '');
          const start = DateTime.fromJSDate(new Date(date)).toLocaleString(
            format
          );
          return `${start}`;
        }
      })
    );

  private generateDateSpan(dates: Date[]): string {
    const start: string = DateTime.fromJSDate(dates[0])
      .toFormat('yyyy-MM-dd')
      .toString();

    const end: string = DateTime.fromJSDate(dates[1])
      .toFormat('yyyy-MM-dd')
      .toString();

    return `toDateSpan(${start}..${end})`;
  }

  private generateSpan(date: Date): string {
    const start: string = DateTime.fromJSDate(date)
      .toFormat('yyyy-MM-dd')
      .toString();

    return `toSpan(${start})`;
  }
}

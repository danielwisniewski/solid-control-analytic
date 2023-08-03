import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  BsDatepickerConfig,
  BsDaterangepickerConfig,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { plLocale } from 'ngx-bootstrap/locale';
import { TimerangeStore } from 'src/app/core/store/timerange.store';
import {
  Observable,
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom,
} from 'rxjs';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import {
  selectActiveTimerange,
  selectTimerangeConfiguration,
} from '../../store/timerange/timerange.selectors';
import { setActiveTimerange } from '../../store/timerange/timerange.actions';
import {
  generateDateSpan,
  generateSpan,
  generateDisplayText,
  generateDateInputFormat,
  generateDashboardTimeRanges,
  verifyTimerange,
} from './timerange.utils';
import { selectActivePage } from '../../store/pages/pages.selectors';

@Component({
  selector: 'app-timerange-dropdown',
  templateUrl: './timerange-dropdown.component.html',
  styleUrls: ['./timerange-dropdown.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerangeDropdownComponent implements OnInit, OnDestroy {
  constructor(
    private localeService: BsLocaleService,
    private TimerangeStore: TimerangeStore,
    private store: Store<AppState>
  ) {}

  type: string = 'range';
  private dateInputFormat: string = 'yyyy-MM-dd';
  private parameters: any = {};
  private ranges = this.TimerangeStore.ranges;

  bsDateRangeConfig: BsDaterangepickerConfig = new BsDaterangepickerConfig();

  bsDateConfig: BsDatepickerConfig = new BsDatepickerConfig();

  pageChange = this.store
    .select(selectActivePage)
    .pipe(
      map((res) => res?.scId),
      distinctUntilChanged(),
      withLatestFrom(
        this.store.select(selectTimerangeConfiguration),
        this.store.select(selectActiveTimerange)
      )
    )
    .subscribe(([id, config, timerange]) => {
      this.store.dispatch(setActiveTimerange({ dates: 'processing...' }));
      this.type = config?.type ?? 'range';
      this.parameters = config?.parameters;
      const isTimerangeNeedsChange = verifyTimerange(
        config,
        this.type,
        this.TimerangeStore.ranges,
        timerange,
        this.parameters
      );

      if (!!isTimerangeNeedsChange) {
        this.store.dispatch(
          setActiveTimerange({
            dates: isTimerangeNeedsChange,
          })
        );
      }

      this.ranges = generateDashboardTimeRanges(
        this.parameters,
        this.TimerangeStore.ranges
      );

      this.dateInputFormat = generateDateInputFormat(
        this.type,
        this.parameters
      );

      if (
        this.type == 'range' &&
        (this.parameters.minMode != 'day' || !this.parameters.minMode)
      ) {
        this.parameters = {
          ...this.parameters,
          minMode: 'day',
          startView: 'day',
        };
      }

      this.bsDateRangeConfig = {
        ...this.bsDateRangeConfig,
        ...this.parameters,
        ranges: this.ranges,
      };
    });

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

  ngOnInit(): void {
    this.localeService.use('pl');
    defineLocale('pl', plLocale);

    this.bsDateRangeConfig = {
      ...this.bsDateRangeConfig,
      adaptivePosition: true,
      ranges: this.ranges,
      preventChangeToNextMonth: true,
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MM-YYYY',
      maxDate: new Date(),
      showPreviousMonth: true,
      customTodayClass: 'bg-info',
      selectWeekDateRange: true,
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
      result = generateDateSpan(event, this.dateInputFormat);
    } else if (this.type === 'single') {
      result = generateSpan(event, this.dateInputFormat);
    }

    if (!result) return;

    this.store.dispatch(setActiveTimerange({ dates: result }));
  }

  displayText$: Observable<string> = this.store
    .select(selectActiveTimerange)
    .pipe(
      filter((val) => typeof val !== 'undefined'),
      map((values) => {
        return generateDisplayText(values, this.type, this.parameters);
      })
    );

  ngOnDestroy(): void {
    this.pageChange.unsubscribe();
  }
}

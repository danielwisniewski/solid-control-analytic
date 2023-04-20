import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  BsDaterangepickerConfig,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';

import { DateTime, DateTimeFormatOptions } from 'luxon';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { plLocale } from 'ngx-bootstrap/locale';

interface IRange {
  value: Date[];
  label: string;
}

@Component({
  selector: 'app-timerange-dropdown',
  templateUrl: './timerange-dropdown.component.html',
  styleUrls: ['./timerange-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerangeDropdownComponent implements OnInit, OnChanges {
  ranges: IRange[] = [
    {
      value: [
        DateTime.local().minus({ week: 1 }).startOf('week').toJSDate(),
        DateTime.local().minus({ week: 1 }).endOf('week').toJSDate(),
      ],
      label: 'Zeszły tydzień',
    },
    {
      value: [DateTime.local().startOf('week').toJSDate(), new Date()],
      label: 'Obecny tydzień',
    },
    {
      value: [
        DateTime.local().minus({ month: 1 }).startOf('month').toJSDate(),
        DateTime.local().minus({ month: 1 }).endOf('month').toJSDate(),
      ],
      label: 'Zeszły miesiąc',
    },
    {
      value: [DateTime.local().startOf('month').toJSDate(), new Date()],
      label: 'Obecny miesiąc',
    },
    {
      value: [
        DateTime.local().minus({ day: 30 }).startOf('day').toJSDate(),
        new Date(),
      ],
      label: 'Ostatnie 30 dni',
    },
    {
      value: [
        DateTime.local().minus({ year: 1 }).startOf('year').toJSDate(),
        DateTime.local().minus({ year: 1 }).endOf('year').toJSDate(),
      ],
      label: 'Zeszły rok',
    },
    {
      value: [DateTime.local().startOf('year').toJSDate(), new Date()],
      label: 'Obecny rok',
    },
  ];
  @Output() timerangeChanged = new EventEmitter<string[]>();
  now: Date = new Date();

  @Input() timerange: string[] = [
    DateTime.local().startOf('month').toFormat('yyyy-MM-dd').toString(),
    DateTime.local().toFormat('yyyy-MM-dd').toString(),
  ];

  bsRangeValue: Date[] = [
    DateTime.local().startOf('month').toJSDate(),
    new Date(),
  ];
  constructor(private localeService: BsLocaleService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['timerange']) return;
    const data: Date[] = [
      new Date(changes['timerange'].currentValue[0]),
      new Date(changes['timerange'].currentValue[1]),
    ];
    this.bsRangeValue = [data[0], data[1]];
  }

  bsConfig: BsDaterangepickerConfig = new BsDaterangepickerConfig();

  ngOnInit(): void {
    this.localeService.use('pl');
    defineLocale('pl', plLocale);

    this.bsConfig = {
      ...this.bsConfig,
      adaptivePosition: true,
      ranges: this.ranges,
      preventChangeToNextMonth: true,
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MM-YYYY',
      maxDate: new Date(),
      showPreviousMonth: true,
      customTodayClass: 'bg-info',
    };
  }

  onHidden(event: any) {
    this.bsRangeValue = event;
    const start: string = DateTime.fromJSDate(this.bsRangeValue![0])
      .toFormat('yyyy-MM-dd')
      .toString();
    const end: string = DateTime.fromJSDate(this.bsRangeValue![1])
      .toFormat('yyyy-MM-dd')
      .toString();
    this.timerangeChanged.emit([start, end]);
  }

  getVal(): string {
    if (this.bsRangeValue) {
      var f: DateTimeFormatOptions = { month: 'long', day: 'numeric' };
      const s = DateTime.fromJSDate(this.bsRangeValue[0]);
      const start = DateTime.fromJSDate(this.bsRangeValue[0]).toLocaleString(f);
      const end = DateTime.fromJSDate(this.bsRangeValue[1]).toLocaleString(f);
      return `${start} - ${end}`;
    } else return 'Wybierz zakres dat';
  }
}

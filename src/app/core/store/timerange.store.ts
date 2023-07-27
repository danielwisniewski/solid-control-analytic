import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs';

export interface IRange {
  value: Date[];
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class TimerangeStore {
  [x: string]: any;
  constructor() {
    if (!!localStorage.getItem('activeTimerange')) {
      const timerange: string = localStorage.getItem('activeTimerange')!;
      this.activeTimerange$.next(timerange);
    } else {
      this.activeTimerange$.next(
        `toSpan(${DateTime.local().toFormat('yyyy-MM-dd').toString()})`
      );
    }
  }

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
        DateTime.local().minus({ day: 2 }).startOf('day').toJSDate(),
        new Date(),
      ],
      label: 'Ostatnie 2 dni',
    },
    {
      value: [
        DateTime.local().minus({ day: 7 }).startOf('day').toJSDate(),
        new Date(),
      ],
      label: 'Ostatnie 7 dni',
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
        DateTime.local().minus({ day: 90 }).startOf('day').toJSDate(),
        new Date(),
      ],
      label: 'Ostatnie 90 dni',
    },
    {
      value: [
        DateTime.local().minus({ quarter: 1 }).startOf('quarter').toJSDate(),
        DateTime.local().minus({ quarter: 1 }).endOf('quarter').toJSDate(),
      ],
      label: 'Zeszły kwartał',
    },
    {
      value: [DateTime.local().startOf('quarter').toJSDate(), new Date()],
      label: 'Obecny kwartał',
    },
    {
      value: [
        DateTime.local().minus({ month: 6 }).startOf('month').toJSDate(),
        new Date(),
      ],
      label: 'Ostatnie 6 miesięcy',
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
    {
      value: [
        DateTime.local().minus({ year: 2 }).startOf('year').toJSDate(),
        new Date(),
      ],
      label: 'Ostatnie 2 lata',
    },
  ];

  activeTimerange$ = new BehaviorSubject<string>(
    `toSpan(${DateTime.local().toFormat('yyyy-MM-dd').toString()})`
  );

  onActiveTimerangeChange(dates: string) {
    this.activeTimerange$.next(dates);
    localStorage.setItem('activeTimerange', dates);
  }

  getActiveTimerange(): string {
    return this.activeTimerange$.getValue();
  }
}

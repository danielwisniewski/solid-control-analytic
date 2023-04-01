import { Injectable } from '@angular/core';
import { HSpan, SpanMode } from 'haystack-core';
import { BehaviorSubject } from 'rxjs';

export interface TimerangeOption {
  dis: string;
  value: string | SpanMode;
  previousRange?: string | SpanMode;
  rollup?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TimerangeStoreService {
  activeTimerange$ = new BehaviorSubject<TimerangeOption>({
    dis: 'Obecny miesiąc',
    value: 'thisMonth',
    rollup: '1day',
  });
  constructor() {}

  getTimerangeOptions(): TimerangeOption[] {
    return [
      {
        dis: 'Dzisiaj',
        value: SpanMode.today,
        rollup: '1hr',
        previousRange: SpanMode.yesterday,
      },
      {
        dis: 'Wczoraj',
        value: SpanMode.yesterday,
        rollup: `1hr`,
        previousRange: 'today()-2day..today()-1day',
      },
      {
        dis: 'Obecny tydzień',
        value: SpanMode.thisWeek,
        rollup: `1day`,
        previousRange: SpanMode.lastWeek,
      },
      {
        dis: 'Zeszły tydzień',
        value: SpanMode.lastWeek,
        rollup: `1day`,
        previousRange: 'lastWeek()-1week',
      },
      {
        dis: 'Ostatnie 7 dni',
        value: 'pastWeek',
        rollup: `1day`,
      },
      {
        dis: 'Obecny miesiąc',
        value: SpanMode.thisMonth,
        rollup: `1day`,
        previousRange: SpanMode.lastMonth,
      },
      {
        dis: 'Zeszły miesiąc',
        value: SpanMode.lastMonth,
        rollup: `1day`,
        previousRange: 'lastMonth()-1mo',
      },
      {
        dis: 'Ostatnie 30 dni',
        value: 'pastMonth',
        rollup: `1day`,
      },
      {
        dis: 'Obecny kwartał',
        value: SpanMode.thisQuarter,
        rollup: `1mo`,
        previousRange: SpanMode.lastQuarter,
      },
      {
        dis: 'Zeszły kwartał',
        value: SpanMode.lastQuarter,
        rollup: `1mo`,
        previousRange: 'lastQuarter()-3mo',
      },
      {
        dis: 'Ostatnie pół roku',
        value: 'today()-6mo..today()',
        rollup: `1mo`,
      },
      {
        dis: 'Obecny rok',
        value: SpanMode.thisYear,
        rollup: '1mo',
        previousRange: SpanMode.lastYear,
      },
      {
        dis: 'Zeszły rok',
        value: SpanMode.lastYear,
        rollup: `1mo`,
        previousRange: 'lastYear()-1yr',
      },
    ];
  }

  getActiveOption(): TimerangeOption {
    return this.activeTimerange$.getValue();
  }

  setActiveOption(timerange: TimerangeOption): void {
    this.activeTimerange$.next(timerange);
  }
}

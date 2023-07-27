import { DateTime, DateTimeFormatOptions } from 'luxon';
import { IRange } from '../../store/timerange.store';

export const DEFAULT_RANGES: string[] = [
  'Zeszły tydzień',
  'Obecny tydzień',
  'Zeszły miesiąc',
  'Obecny miesiąc',
  'Ostatnie 30 dni',
  'Zeszły rok',
  'Obecny rok',
];

export function generateDateSpan(
  dates: Date[],
  dateInputFormat: string
): string {
  const start: string = DateTime.fromJSDate(dates[0])
    .toFormat(dateInputFormat)
    .toString();

  const end: string = DateTime.fromJSDate(dates[1])
    .toFormat(dateInputFormat)
    .toString();

  return `toDateSpan(${start}..${end})`;
}

export function generateSpan(date: Date, dateInputFormat: string): string {
  const start: string = DateTime.fromJSDate(date)
    .toFormat(dateInputFormat)
    .toString();

  return `toSpan(${start})`;
}

export function generateDisplayText(
  values: string,
  type: string,
  parameters: any
): string {
  let format: DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  if (parameters.minMode == 'month') {
    format = {
      month: 'long',
    };
  } else if (parameters.minMode == 'year') {
    format = {
      year: 'numeric',
    };
  }

  if (type === 'range') {
    const dates: string[] = values
      .replace('toDateSpan(', '')
      .replace(')', '')
      .split('..');
    const start = DateTime.fromJSDate(new Date(dates[0])).toLocaleString(
      format
    );
    const end = DateTime.fromJSDate(new Date(dates[1])).toLocaleString(format);

    return `${start} - ${end}`;
  } else {
    const date = values.replace('toSpan(', '').replace(')', '');
    const start = DateTime.fromJSDate(new Date(date)).toLocaleString(format);
    return `${start.toLocaleUpperCase()}`;
  }
}

export function generateDateInputFormat(type: string, parameters: any): string {
  if (!!parameters && !!parameters.minMode && type == 'single') {
    if (parameters.minMode == 'day') return 'yyyy-MM-dd';
    else if (parameters.minMode == 'month') return 'yyyy-MM';
    else if (parameters.minMode == 'year') return 'yyyy';
    else return 'yyyy-MM-dd';
  } else return 'yyyy-MM-dd';
}

export function generateDashboardTimeRanges(
  parameters: any,
  allRanges: IRange[]
): IRange[] {
  if (!!parameters.displayedRanges) {
    return allRanges.filter((range) =>
      parameters.displayedRanges.some((r: string) => r === range.label)
    );
  } else {
    return allRanges.filter((range) =>
      DEFAULT_RANGES.some((r: string) => r === range.label)
    );
  }
}

export function verifyTimerange(
  config: any,
  type: string,
  ranges: IRange[],
  timerange: string,
  parameters: any
): string | undefined {
  if (timerange === 'processing...') return;
  if (!!config.defaultRange) {
    const defaultRange = ranges.find((r) => r.label == config.defaultRange);
    if (!!defaultRange)
      return generateDateSpan(
        defaultRange.value,
        generateDateInputFormat(type, parameters)
      );
    else return;
  } else if (type == 'single' && timerange.startsWith('toDateSpan')) {
    return generateSpan(new Date(), generateDateInputFormat(type, parameters));
  } else if (type === 'range' && timerange.startsWith('toSpan')) {
    return generateDateSpan(
      [DateTime.local().startOf('week').toJSDate(), new Date()],
      generateDateInputFormat(type, parameters)
    );
  } else return generateDefaultTimerange(type, parameters);
}

export function generateDefaultTimerange(
  type: string,
  parameters: any
): string {
  const localStore = localStorage.getItem('activeTimerange');
  const dateInputFormat = generateDateInputFormat(type, parameters);
  if (!!localStore) return localStore;
  else if (type === 'single') {
    return generateSpan(new Date(), dateInputFormat);
  } else
    return generateDateSpan(
      [DateTime.local().startOf('week').toJSDate(), new Date()],
      dateInputFormat
    );
}

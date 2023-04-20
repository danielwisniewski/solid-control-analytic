import { ChartOptions, scales } from 'chart.js';
import { HGrid, HDateTime, HTime, Kind } from 'haystack-core';
import { lang } from 'src/app/features/dashboard/lexicons/dashboard-page.lexicon';
import { GRID_COLOR, TEXT_COLOR, getUnit } from './chart-utils';
import { getChartType } from './type.utils';

export function generateTimeUnit(
  grid: HGrid
):
  | false
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | undefined {
  if (grid.getColumnNames()[0] !== 'ts') return;

  const TIMESTAMP_LIST = generateTimestampLabels(grid);
  if (TIMESTAMP_LIST.length < 2) return 'year';
  const FIRST_TIMESTAMP =
    new Date(TIMESTAMP_LIST[1]).toString() != 'Invalid Date'
      ? new Date(TIMESTAMP_LIST[1] as string)
      : new Date(
          1970,
          1,
          1,
          +TIMESTAMP_LIST[1].toString().split(':')[0] as number,
          +TIMESTAMP_LIST[1].toString().split(':')[1] as number
        );
  const SECOND_TIMESTAMP =
    new Date(TIMESTAMP_LIST[2]).toString() != 'Invalid Date'
      ? new Date(TIMESTAMP_LIST[2] as string)
      : new Date(
          1970,
          1,
          1,
          +TIMESTAMP_LIST[2].toString().split(':')[0] as number,
          +TIMESTAMP_LIST[2].toString().split(':')[1] as number
        );

  const TIME_DIFFERENCE_HOURS =
    (SECOND_TIMESTAMP.getTime() - FIRST_TIMESTAMP.getTime()) / (1000 * 3600);

  if (TIME_DIFFERENCE_HOURS > 7000) return 'year';
  if (TIME_DIFFERENCE_HOURS > 400) return 'month';
  if (TIME_DIFFERENCE_HOURS >= 24) return 'day';
  if (TIME_DIFFERENCE_HOURS >= 1) return 'hour';
  if (TIME_DIFFERENCE_HOURS < 1) return 'minute';
  else return false;
}

function generateTimestampLabels(grid: HGrid): string[] {
  return grid.listBy<HDateTime | HTime>('ts').map((ts) => {
    if (ts.isKind(Kind.DateTime)) return HDateTime.make(ts.value).iso;
    else return HTime.make(ts.value).value;
  });
}

export function generateScales(reqResponse: HGrid): ChartOptions {
  if (reqResponse.isEmpty()) return pieScales(reqResponse);

  const chartType = getChartType(reqResponse);

  if (chartType === 'bar' || chartType === 'line')
    return timeseriesScales(reqResponse);
  else if (chartType === 'ranking') return rankingScales(reqResponse);
  else return pieScales(reqResponse);
}

function timeseriesScales(reqResponse: HGrid): ChartOptions {
  return {
    scales: {
      y: {
        type: 'linear',
        grid: {
          color: GRID_COLOR,
          drawTicks: true,
          display: true,
        },
        ticks: {
          padding: 20,
          autoSkip: true,
          display: true,
          color: TEXT_COLOR,
          callback(tickValue, index, ticks) {
            const UNIT = getUnit(reqResponse);
            return `${tickValue} ${UNIT}`;
          },
        },
        min: 0,
        stacked: reqResponse.meta.has('stacked'),
      },
      x: {
        type: 'timeseries',
        time: {
          unit: generateTimeUnit(reqResponse),
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            month: 'MMM yyyy',
          },
        },
        grid: {
          color: GRID_COLOR,
        },
        ticks: {
          color: TEXT_COLOR,
          align: 'center',
          source: 'auto',
          stepSize: 1,
          autoSkip: true,
        },
        adapters: {
          date: {
            locale: lang,
          },
        },
        stacked: reqResponse.meta.has('stacked'),
      },
    },
  };
}

function rankingScales(reqResponse: HGrid): ChartOptions {
  return {
    scales: {
      y: {
        type: 'category',
        grid: {
          color: GRID_COLOR,
          drawTicks: true,
          display: true,
        },
        ticks: {
          padding: 10,
          display: true,
          color: TEXT_COLOR,
        },
      },
      x: {
        type: 'linear',
        grid: {
          color: GRID_COLOR,
          drawTicks: true,
          display: true,
        },
        ticks: {
          color: TEXT_COLOR,
          autoSkip: true,
          display: true,
          autoSkipPadding: 20,
          callback(tickValue, index, ticks) {
            const UNIT = getUnit(reqResponse);
            return `${tickValue} ${UNIT}`;
          },
        },
      },
    },
  };
}

function pieScales(reqResponse: HGrid): ChartOptions {
  return {
    scales: {},
  };
}

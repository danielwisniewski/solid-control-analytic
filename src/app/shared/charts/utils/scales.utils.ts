import { ChartOptions, scales } from 'chart.js';
import { HGrid, HDateTime, HTime, Kind } from 'haystack-core';
import { GRID_COLOR, TEXT_COLOR, getUnit } from './chart-utils';
import { getChartType } from './type.utils';
import { DateTime } from 'luxon';

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
      ...generateYAxis(reqResponse).scales,
      x: {
        type: 'time',
        time: {
          unit: generateTimeUnit(reqResponse),
          minUnit: 'hour',
          round: generateTimeUnit(reqResponse),
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
          source: 'labels',
          stepSize: 1,
          autoSkip: true,
        },
        adapters: {
          date: {
            locale: 'pl',
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

  const FIRST_TIMESTAMP = TIMESTAMP_LIST.pop();
  const SECOND_TIMESTAMP = TIMESTAMP_LIST.shift();

  const TIME_DIFFERENCE_HOURS = DateTime.fromISO(FIRST_TIMESTAMP!).diff(
    DateTime.fromISO(SECOND_TIMESTAMP!),
    'hours'
  ).hours;

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

export function generateUnitsObject(
  reqResponse: HGrid
): { unit: string; axisName: string }[] {
  let units: any[] = [];

  reqResponse.getColumns().forEach((column) => {
    const unit = column.meta.get('unit')?.toString();
    if (typeof unit !== 'undefined' && unit !== null)
      units.push(column.meta.get('unit')!.toString());
  });

  units = [...new Set(units)];

  return units.map((val: string, index: number) => {
    return {
      unit: val,
      axisName: `y${index}`,
    };
  });
}

function generateYAxis(reqResponse: HGrid): ChartOptions {
  const unitsObject = generateUnitsObject(reqResponse);

  let yAxisChartOptions: ChartOptions = {};

  for (let index = 0; index < unitsObject.length; index++) {
    yAxisChartOptions = {
      scales: {
        ...yAxisChartOptions.scales,
        [`y${index}`]: {
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
            callback(tickValue, i, ticks) {
              let unit = unitsObject[index]?.unit ?? '';
              if (unit.startsWith('_')) unit = unit.slice(1);
              return `${tickValue} ${unit}`;
            },
          },
          min: 0,
          stacked: reqResponse.meta.has('stacked'),
          position: index % 2 ? 'right' : 'left',
        },
      },
    };
  }

  return yAxisChartOptions;
}

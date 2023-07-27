import { ChartOptions } from 'chart.js';
import { HBool, HGrid, HStr } from 'haystack-core';
import { getChartType } from './type.utils';

export function generateLegend(reqResponse: HGrid): ChartOptions {
  if (reqResponse.isEmpty()) return emptyData();
  const TYPE = getChartType(reqResponse);

  if (TYPE === 'bar' || TYPE === 'line')
    return generateTimeseriesLegend(reqResponse);
  else return generatePieLegend(reqResponse);
}

function generateTimeseriesLegend(reqResponse: HGrid): ChartOptions {
  return {
    plugins: {
      legend: {
        display: !!reqResponse.meta.get<HBool>('showLegend')?.value,

        position: !!reqResponse.meta.get('legendPosition')
          ? (reqResponse.meta.get('legendPosition')?.toString() as any)
          : 'right',
        labels: {
          filter(item, data) {
            if (item.text.startsWith('v')) return false;
            else if (data.datasets.length < 2) return false;
            else return true;
          },
          usePointStyle: true,
        },
        maxHeight: 50,
      },
    },
  };
}

function generatePieLegend(reqResponse: HGrid): ChartOptions {
  return {
    plugins: {
      legend: {
        display: !!reqResponse.meta.get<HBool>('showLegend')?.value,
        maxWidth: !!reqResponse.meta.get<HBool>('showLegend')?.value ? 300 : 1,
        position: !!reqResponse.meta.get('legendPosition')
          ? (reqResponse.meta.get('legendPosition')?.toString() as any)
          : 'bottom',
        labels: {
          filter(item, data) {
            if (
              reqResponse.meta.get<HStr>('chartType')?.value.toString() ===
              'ranking'
            )
              return false;
            return true;
          },
          usePointStyle: true,
        },
      },
    },
  };
}

function emptyData(): ChartOptions {
  return {
    plugins: {
      legend: {
        display: false,
        maxHeight: 1,
        maxWidth: 1,
      },
    },
  };
}

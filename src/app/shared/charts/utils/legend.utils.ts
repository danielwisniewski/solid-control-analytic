import { ChartOptions } from 'chart.js';
import { HGrid } from 'haystack-core';
import { TEXT_COLOR } from './chart-utils';
import { getChartType } from './type.utils';

export function generateLegend(reqResponse: HGrid): ChartOptions {
  if (reqResponse.isEmpty()) return emptyData();
  const TYPE = getChartType(reqResponse);

  if (TYPE === 'bar' || TYPE === 'line') return generateTimeseriesLegend();
  else return generatePieLegend(reqResponse);
}

function generateTimeseriesLegend(): ChartOptions {
  return {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: TEXT_COLOR,
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
        display: !!reqResponse.meta.get('showLegend') ? true : false,
        maxWidth: !!reqResponse.meta.get('showLegend') ? 300 : 1,
        position: 'right',
        title: {
          color: TEXT_COLOR,
          position: 'center',
          text: 'LEGENDA',
          display: false,
        },
        labels: {
          color: TEXT_COLOR,
          font: {
            size: 12,
            family: 'Poppins, sans-serif',
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

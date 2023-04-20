import { ChartOptions } from 'chart.js';
import { getChartType } from './type.utils';
import { TEXT_COLOR } from './chart-utils';
import { HGrid } from 'haystack-core';

import { Context } from 'chartjs-plugin-datalabels';

export function generateDataLabels(reqResponse: HGrid): ChartOptions {
  const TYPE = getChartType(reqResponse);

  if (TYPE === 'pie' || TYPE === 'donut' || TYPE === 'ranking') {
    return {
      plugins: {
        datalabels: {
          color: TEXT_COLOR,
          display: true,
          formatter(value, context) {
            let sum: number = context.dataset.data.reduce(
              (a, b) => Number(a) + Number(b),
              0
            ) as number;
            let percentage = ((value * 100) / sum).toFixed(0) + '%';
            return percentage;
          },
        },
      },
    };
  } else
    return {
      plugins: {
        datalabels: {
          display: false,
        },
      },
    };
}

import { ChartOptions } from 'chart.js';
import { HBool, HGrid, HStr } from 'haystack-core';
import { TEXT_COLOR } from './chart-utils';

export function generateTitle(reqResponse: HGrid): ChartOptions {
  if (reqResponse.isEmpty()) {
    return {
      plugins: {
        title: {
          display: true,
          text: !!reqResponse.meta.get('noDataTitle')
            ? reqResponse.meta.get('noDataTitle')?.toString()
            : 'Nie znaleziono danych',
          font: {
            size: 14,
          },
        },
      },
    };
  } else {
    return {
      plugins: {
        title: {
          display: !!reqResponse.meta.get<HBool>('showSubtitle')?.value,
          text: reqResponse.meta.get<HStr>('subtitle')?.toString(),
          font: {
            size: 14,
          },
        },
      },
    };
  }
}

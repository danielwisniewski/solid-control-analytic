import { ChartOptions } from 'chart.js';
import { HBool, HGrid, HStr } from 'haystack-core';

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
            size: 17,
          },
        },
        subtitle: {
          display: true,
          text: !!reqResponse.meta.get('noDataSubtitle')
            ? reqResponse.meta.get('noDataSubtitle')?.toString().split('/n')
            : 'Spróbuj wybrać inne urządzenie lub czasookres',
          font: {
            size: 15,
          },
          padding: 15,
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

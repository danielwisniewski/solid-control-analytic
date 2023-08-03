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
            size(ctx, options) {
              const width = ctx.chart.width;
              let size = Math.round(width / 40);
              if (size > 17) size = 17;
              if (size < 13) size = 13;
              return size;
            },
          },
        },
        subtitle: {
          display: true,
          text: !!reqResponse.meta.get('noDataSubtitle')
            ? reqResponse.meta.get('noDataSubtitle')?.toString().split('/n')
            : 'Spróbuj wybrać inne urządzenie lub czasookres',
          font: {
            size: 15,
            lineHeight: '1rem',
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
            size(ctx, options) {
              const width = ctx.chart.width;
              let size = Math.round(width / 40);
              if (size > 14) size = 14;
              if (size < 12) size = 12;
              return size;
            },
          },
        },
      },
    };
  }
}

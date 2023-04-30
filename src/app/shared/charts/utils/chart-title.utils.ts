import { ChartOptions } from 'chart.js';
import { HGrid } from 'haystack-core';
import { TEXT_COLOR } from './chart-utils';

export function generateTitle(reqResponse: HGrid): ChartOptions {
  if (reqResponse.isEmpty()) {
    return {
      plugins: {
        title: {
          display: true,
          color: TEXT_COLOR,
          text: 'Nie znaleziono danych',
          font: {
            size: 17,
            family: 'Poppins, sans-serif',
          },
        },
      },
    };
  } else {
    return {
      plugins: {
        title: {
          display: true,
          color: TEXT_COLOR,
          text: reqResponse.meta.get('title')?.toString() ?? ' ',
          font: {
            size: 17,
            family: 'Poppins, sans-serif',
          },
        },
      },
    };
  }
}

export function generateSubTitle(reqResponse: HGrid): ChartOptions {
  if (reqResponse.isEmpty())
    return {
      plugins: {
        subtitle: {
          display: true,
          color: TEXT_COLOR,
          text: 'Spróbuj wybrać inne urządzenie lub zmień czasookres',
          font: {
            size: 14,
            family: 'Poppins, sans-serif',
          },
        },
      },
    };
  else {
    return {
      plugins: {
        subtitle: {
          display: true,
          color: TEXT_COLOR,
          padding: 10,
          text: reqResponse.meta.get('subtitle')?.toString() ?? ' ',
          font: {
            size: 14,
            family: 'Poppins, sans-serif',
          },
        },
      },
    };
  }
}

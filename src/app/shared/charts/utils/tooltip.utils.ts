import { ChartOptions } from 'chart.js';
import { getUnit } from './chart-utils';
import { HGrid, HStr, HUnit, HVal } from 'haystack-core';
import { getChartType } from './type.utils';

export function generateTooltip(reqResponse: HGrid): ChartOptions {
  const type = getChartType(reqResponse);
  const isPie = type === 'pie' || type === 'donut' || type === 'ranking';
  return {
    plugins: {
      tooltip: {
        backgroundColor: '#f5f5f5',
        titleColor: '#333',
        bodyColor: '#666',
        bodySpacing: 8,
        padding: 16,
        mode: isPie ? 'dataset' : 'index',
        intersect: false,
        position: 'nearest',
        titleAlign: 'center',
        cornerRadius: 12,
        boxPadding: 6,
        callbacks: {
          label(context) {
            let label = context.dataset.label ?? '';
            const colDis = reqResponse.getColumn(label)?.dis;

            if (isPie) label = context.label;

            if (colDis && colDis[0] === colDis[0].toUpperCase()) label = colDis;

            let UNIT =
              reqResponse
                .getColumn(context.datasetIndex)
                ?.meta.get<HStr>('unit')
                ?.toString() || getUnit(reqResponse);

            if (UNIT.startsWith('_')) UNIT = UNIT.slice(1);

            return `${label}: ${context.formattedValue} ${UNIT}`;
          },
        },
        itemSort(a, b, data) {
          return Number(b.raw) - Number(a.raw);
        },
        usePointStyle: true,
      },
    },
  };
}

import { ChartType } from 'chart.js';
import { HGrid } from 'haystack-core';

export function getChartType(grid: HGrid): string {
  if (grid.meta.has('chartType'))
    return grid.meta.get('chartType')?.toString() ?? 'bar';

  return 'bar';
}

export function chartjsType(grid: HGrid): ChartType {
  //if (grid.isEmpty()) return 'pie';
  const chartTypes: { [key: string]: ChartType } = {
    bar: 'bar',
    ranking: 'bar',
    line: 'line',
    donut: 'doughnut',
    pie: 'pie',
  };
  let type = 'bar';

  if (grid.meta.has('chartType'))
    return chartTypes[grid.meta.get('chartType')!.toString()];

  return chartTypes[type];
}

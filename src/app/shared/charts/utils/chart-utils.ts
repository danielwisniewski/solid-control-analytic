import { BarOptions, LineOptions } from '../../interfaces/bar-options';
import { Chart, ChartOptions } from 'chart.js';
import { HDateTime, HGrid, HNum, HTime, Kind } from 'haystack-core';
import { lang } from 'src/app/features/dashboard/lexicons/dashboard-page.lexicon';

export const CHART_COLOR: string[] = [
  'rgb(255,215,0)',
  'rgb(78, 121, 167)',
  'rgb(242, 142, 44)',
  'rgb(225, 87, 89)',
  'rgb(118, 183, 178)',
  'rgb(89, 161, 79)',
  'rgb(237, 201, 73)',
  'rgb(175, 122, 161)',
  'rgb(255, 157, 167)',
  'rgb(156, 117, 95)',
  'rgb(186, 176, 171)',
];

export const TEXT_COLOR: string = 'rgba(255, 255, 255, 0.8)';
export const GRID_COLOR: string = 'rgba(255, 255, 255, 0.1)';

export function generateGradientStroke(
  context: any,
  options: any
): CanvasGradient {
  const chart = context.chart;
  const { ctx, chartArea } = chart;
  const gradientStroke = ctx.createLinearGradient(450, 400, 450, 0);
  gradientStroke.addColorStop(
    1,
    options.replace('rgb', 'rgba').replace(')', ', 0.8)')
  );
  gradientStroke.addColorStop(
    0,
    options.replace('rgb', 'rgba').replace(')', ', 0.5)')
  );
  return gradientStroke;
}

export function getUnit(grid: HGrid): string {
  if (grid.isEmpty()) return '';
  let columnName =
    grid.getColumnNames()[0] === 'ts'
      ? grid.getColumnNames()[1]
      : grid.getColumnNames()[0];
  if (grid.listBy<HNum>(columnName).isEmpty()) return '';

  let unit = grid.listBy<HNum>(columnName).get(0)?.unit?.symbol;
  if (unit?.startsWith('_')) unit = unit.slice(1);

  return typeof unit !== 'undefined' ? unit : '';
}

export function selectMainColor(
  index: number,
  barOptions: BarOptions | LineOptions
): string {
  if (index === 0 && barOptions.mainColor) return barOptions.mainColor;
  else return CHART_COLOR[index];
}

export function onResize(
  chart: Chart,
  size: { width: number; height: number }
) {
  if (
    chart.options &&
    chart.options.scales &&
    chart.options.scales['y'] &&
    chart.options.scales['y'].ticks &&
    chart.options.scales['y'].type !== 'category'
  ) {
    if (size.width < 600) chart.options.scales['y'].ticks.display = false;
    else chart.options.scales['y'].ticks.display = true;
  }

  if (chart.options && chart.options.plugins && chart.options.plugins.legend) {
    if (size.height < 300 && size.width < 400)
      chart.options.plugins.legend.display = false;
    else chart.options.plugins.legend.display = true;
  }
}

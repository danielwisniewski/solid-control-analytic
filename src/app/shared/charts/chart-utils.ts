import { BarOptions, LineOptions } from '../interfaces/bar-options';
import { ChartOptions } from 'chart.js';
import { HGrid, HNum } from 'haystack-core';

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
  if (grid.listBy<HNum>('v0').isEmpty()) return '';

  let unit = grid.listBy<HNum>('v0').get(0)?.unit?.symbol;
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

export const defaultOptions: ChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  animation: {
    duration: 900,
  },
  scales: {
    y: {
      type: 'linear',
      grid: {
        color: GRID_COLOR,
        drawTicks: true,
        display: true,
      },
      ticks: {
        padding: 20,
        autoSkip: true,
        display: true,
        color: TEXT_COLOR,
      },
      min: 0,
    },
    x: {
      type: 'timeseries',
      time: {
        unit: false,
      },
      grid: {
        color: GRID_COLOR,
      },
      ticks: {
        color: TEXT_COLOR,
        align: 'center',
        source: 'labels',
        stepSize: 1,
      },
      adapters: {
        date: {
          locale: 'pl',
        },
      },
    },
  },
  plugins: {
    tooltip: {
      backgroundColor: '#f5f5f5',
      titleColor: '#333',
      bodyColor: '#666',
      bodySpacing: 8,
      padding: 16,
      mode: 'index',
      intersect: false,
      position: 'average',
      titleAlign: 'center',
      cornerRadius: 12,
      boxPadding: 6,
    },
    legend: {
      position: 'chartArea',
      labels: {
        color: TEXT_COLOR,
      },
      title: {
        display: false,
      },
    },
  },
};

import { Chart } from 'chart.js';
import { HGrid, HNum } from 'haystack-core';
import { environment } from 'src/environments/environment';

export const CHART_COLOR: string[] = environment.chartColorsPalette;

export const TEXT_COLOR: string = 'rgba(255, 255, 255, 0.8)';
export const GRID_COLOR: string = 'rgba(255, 255, 255, 0.1)';

export function generateGradientStroke(ctx: any, options: any): CanvasGradient {
  let color = options;
  if (color.includes('rgba')) color = convertRGBAtoRGB(color);
  const gradient = ctx.createLinearGradient(0, 0, 0, 450);
  gradient.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ', 0.5)'));
  gradient.addColorStop(
    0.5,
    color.replace('rgb', 'rgba').replace(')', ', 0.25)')
  );
  gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0.0)'));
  return gradient;
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

export function onResize(
  chart: Chart,
  size: { width: number; height: number }
) {
  if (
    !!chart.options &&
    !!chart.options.scales &&
    !!chart.options.scales['y0'] &&
    chart.options.scales['y0'].type !== 'category'
  ) {
    if (size.width < 450) chart.options.scales['y0'].display = false;
    else chart.options.scales['y0'].display = true;

    chart.update();
  }

  if (chart.options && chart.options.plugins && chart.options.plugins.legend) {
    if (size.width < 450) chart.options.plugins.legend.position = 'bottom';
    else chart.options.plugins.legend.display = true;
  }
}

function convertRGBAtoRGB(rgba: string): string {
  const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*\d+(\.\d+)?\)/);
  if (match) {
    const [, r, g, b] = match;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Return original string if it doesn't match the expected format
    return rgba;
  }
}

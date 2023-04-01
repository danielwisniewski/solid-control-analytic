import { ChartDataset } from 'chart.js';

export interface BarOptions {
  labels: unknown[];
  dataset: ChartDataset<'bar', number[]>[];
  barType: 'ranking' | 'time';
  yAxisUnit: string;
  xAxisType?: 'day' | 'month';
  yAxisTitle?: string;
  mainColor?: string;
}

export interface LineOptions {
  labels: unknown[];
  dataset: ChartDataset<'line', number[]>[];
  yAxisUnit: string;
  xAxisType?: 'day' | 'month';
  yAxisTitle?: string;
  mainColor?: string;
}

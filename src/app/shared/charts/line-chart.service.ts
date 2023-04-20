import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartDataset } from 'chart.js';

import { BarOptions, LineOptions } from '../interfaces/bar-options';

import {
  TEXT_COLOR,
  generateGradientStroke,
  selectMainColor,
} from './utils/chart-utils';

@Injectable({
  providedIn: 'root',
})
export class LineChartService {
  constructor() {}

  generateLineChart(options: LineOptions): ChartConfiguration<'line'> {
    return {
      data: {
        labels: options.labels,
        datasets: options.dataset.map(
          (dataset: ChartDataset<'line', number[]>, index) => {
            return {
              borderColor: selectMainColor(index, options),
              borderWidth: 0.2,
              backgroundColor(context: any, options: any) {
                return generateGradientStroke(
                  context,
                  selectMainColor(index, options)
                );
              },
              hoverBackgroundColor(context: any, options: any) {
                return generateGradientStroke(
                  context,
                  selectMainColor(index, options)
                );
              },
              hoverBorderColor(context: any, options: any) {
                return generateGradientStroke(
                  context,
                  selectMainColor(index, options)
                );
              },
              inflateAmount: 1,
              ...dataset,
            };
          }
        ),
      },
      type: 'line',
    };
  }
}

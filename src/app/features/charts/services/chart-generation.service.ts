import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartOptions, Chart } from 'chart.js';

import 'chartjs-adapter-luxon';

import { HGrid } from 'haystack-core';

import { CHART_COLOR, TEXT_COLOR, onResize } from '../utils/chart-utils';
import { generateScales } from '../utils/scales.utils';
import { generateTooltip } from '../utils/tooltip.utils';
import { generateLegend } from '../utils/legend.utils';
import { generateLabels } from '../utils/labels.utils';
import { generateDatasetsArray } from '../utils/dataset.util';
import { chartjsType } from '../utils/type.utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { generateDataLabels } from '../utils/datalabels.utils';
import { generateTitle } from '../utils/chart-title.utils';
@Injectable({
  providedIn: 'root',
})
export class ChartGenerationService {
  constructor() {
    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = 'Poppins, sans-serif';
    Chart.defaults.color = TEXT_COLOR;
  }

  /**
   * Main function called from component to generate default chart configuration
   * @param chartData API response in HGrid format. Timestamp columns must have name "ts", and values columns must have names as follows "v0", "v1" etc
   * @param colors Bars/Lines colors to use. If not defined then default values will be used.
   * @returns Chart configuration that can be used in the component
   */
  generateChart(
    chartData: HGrid,
    colors: string[] = CHART_COLOR
  ): ChartConfiguration {
    return {
      data: {
        labels: generateLabels(chartData),
        datasets: generateDatasetsArray(chartData, colors),
      },
      options: this.generateChartOptions(chartData),
      type: chartjsType(chartData),
    };
  }

  /**
   * Function generates default chart options that should be universal. Any customization should be made inside component.
   * @param reqResponse API response in HGrid format. Timestamp columns must have name "ts", and values columns must have names as follows "v0", "v1" etc
   * @returns
   */
  private generateChartOptions(reqResponse: HGrid): ChartOptions {
    return {
      maintainAspectRatio: false,
      responsive: true,
      indexAxis:
        reqResponse.meta.has('chartType') &&
        reqResponse.meta.get('chartType')?.toString() == 'ranking'
          ? 'y'
          : 'x',
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      animation: {
        duration: 900,
      },
      onResize(chart, size) {
        onResize(chart, size);
      },
      plugins: {
        tooltip: generateTooltip(reqResponse).plugins?.tooltip,
        title: generateTitle(reqResponse).plugins?.title,
        subtitle: generateTitle(reqResponse).plugins?.subtitle,
        legend: generateLegend(reqResponse).plugins?.legend,
        datalabels: generateDataLabels(reqResponse).plugins?.datalabels,
      },
      scales: generateScales(reqResponse)['scales'],
    };
  }
}

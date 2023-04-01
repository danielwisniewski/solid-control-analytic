import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';

import 'chartjs-adapter-luxon';

import { HDateTime, HGrid, HNum, HStr, HTime, Kind } from 'haystack-core';
import { lang } from 'src/app/features/dashboard/lexicons/dashboard-page.lexicon';

import { CHART_COLOR, getUnit, GRID_COLOR, TEXT_COLOR } from '../chart-utils';

@Injectable({
  providedIn: 'root',
})
export class ChartGenerationService {
  constructor() {}

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
        labels: this.generateLabels(chartData),
        datasets: this.generateDatasetsArray(chartData, colors),
      },
      options: this.generateChartOptions(chartData),
      type: 'bar',
    };
  }

  /**
   * Function called from component to update chart data
   * @param chart Chart element that should be updated
   * @param reqResponse API response in HGrid format. Timestamp columns must have name "ts", and values columns must have names as follows "v0", "v1" etc
   * @param colors Bars/Lines colors to use. If not defined then default values will be used.
   * @returns Updated chart configuration that can be used in the component
   */
  updateChart(
    chart: ChartConfiguration,
    reqResponse: HGrid,
    colors: string[] = CHART_COLOR
  ): ChartConfiguration {
    chart.data.labels = this.generateLabels(reqResponse);
    chart.data.datasets = this.generateDatasetsArray(reqResponse, colors);

    chart.options!.scales!['x'] = {
      ...chart.options!.scales!['x'],
      type: 'timeseries',
      time: {
        unit: this.generateTimeUnit(reqResponse),
        displayFormats: {
          minute: 'HH:mm',
          hour: 'HH:mm',
          month: 'MMMM',
        },
      },
    };

    return chart;
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
      animation: {
        duration: 900,
      },
      onResize(chart, size) {
        if (
          chart.options &&
          chart.options.scales &&
          chart.options.scales['y'] &&
          chart.options.scales['y'].ticks
        ) {
          if (size.width < 600) chart.options.scales['y'].ticks.display = false;
          else chart.options.scales['y'].ticks.display = true;
        }

        if (
          chart.options &&
          chart.options.plugins &&
          chart.options.plugins.legend
        ) {
          if (size.height < 300 && size.width < 400)
            chart.options.plugins.legend.display = false;
          else chart.options.plugins.legend.display = true;
        }
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
          callbacks: {
            label(context) {
              const UNIT = getUnit(reqResponse);
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label +=
                  new Intl.NumberFormat('pl').format(context.parsed.y) +
                  ` ${UNIT}`;
              }
              return label;
            },
          },
          usePointStyle: true,
        },
        legend: {
          position: 'bottom',
          labels: {
            color: TEXT_COLOR,
            filter(item, data) {
              if (item.text.startsWith('v')) return false;
              else if (data.datasets.length < 2) return false;
              else return true;
            },
            usePointStyle: true,
          },
        },
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
            callback(tickValue, index, ticks) {
              const UNIT = getUnit(reqResponse);
              return `${tickValue} ${UNIT}`;
            },
          },
          min: 0,
        },
        x: {
          type: 'timeseries',
          time: {
            unit: this.generateTimeUnit(reqResponse),
            displayFormats: {
              minute: 'HH:mm',
              hour: 'HH:mm',
              month: 'MMM yyyy',
            },
          },
          grid: {
            color: GRID_COLOR,
          },
          ticks: {
            color: TEXT_COLOR,
            align: 'center',
            source: 'labels',
            stepSize: 1,
            autoSkip: true,
          },
          adapters: {
            date: {
              locale: lang,
            },
          },
        },
      },
    };
  }

  private generateDataPropertyByColumnName(
    grid: HGrid,
    name: string
  ): number[] {
    return grid
      .listBy<HNum>(name)
      .map((value) => this.calculatePrecision(value));
  }

  private calculatePrecision(val: HNum): number {
    if (val.value < 1) return +Number(val.value).toFixed(3);
    else if (val.value < 10) return +Number(val.value).toFixed(2);
    else return +Number(val.value).toFixed(1);
  }

  private generateLabels(grid: HGrid): string[] {
    const FIRST_COLUMN_NAME = grid.getColumnNames()[0];

    if (FIRST_COLUMN_NAME !== 'ts') {
      return grid.listBy<HStr>(FIRST_COLUMN_NAME).map((val) => val.toString());
    } else {
      return grid.listBy<HDateTime | HTime>('ts').map((ts) => {
        if (ts.isKind(Kind.DateTime)) return HDateTime.make(ts.value).iso;
        else return HTime.make(ts.value).value;
      });
    }
  }

  private generateTimeUnit(
    grid: HGrid
  ):
    | false
    | 'millisecond'
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'quarter'
    | 'year'
    | undefined {
    if (grid.getColumnNames()[0] !== 'ts') return;
    const TIMESTAMP_LIST = this.generateLabels(grid);

    const FIRST_TIMESTAMP =
      new Date(TIMESTAMP_LIST[1]).toString() != 'Invalid Date'
        ? new Date(TIMESTAMP_LIST[1] as string)
        : new Date(
            1970,
            1,
            1,
            +TIMESTAMP_LIST[1].toString().split(':')[0] as number,
            +TIMESTAMP_LIST[1].toString().split(':')[1] as number
          );
    const SECOND_TIMESTAMP =
      new Date(TIMESTAMP_LIST[2]).toString() != 'Invalid Date'
        ? new Date(TIMESTAMP_LIST[2] as string)
        : new Date(
            1970,
            1,
            1,
            +TIMESTAMP_LIST[2].toString().split(':')[0] as number,
            +TIMESTAMP_LIST[2].toString().split(':')[1] as number
          );

    const TIME_DIFFERENCE_HOURS =
      (SECOND_TIMESTAMP.getTime() - FIRST_TIMESTAMP.getTime()) / (1000 * 3600);

    if (TIME_DIFFERENCE_HOURS > 7000) return 'year';
    if (TIME_DIFFERENCE_HOURS > 400) return 'month';
    if (TIME_DIFFERENCE_HOURS >= 24) return 'day';
    if (TIME_DIFFERENCE_HOURS >= 1) return 'hour';
    if (TIME_DIFFERENCE_HOURS < 1) return 'minute';
    else return false;
  }

  private generateDatasetsArray(
    reqResponse: HGrid,
    colors: string[]
  ): ChartDataset[] {
    const CHART_DATASETS = [];
    for (let i = 1; i < reqResponse.getColumnsLength(); i++) {
      const SOLID_COLOR =
        typeof colors[i - 1] !== 'undefined'
          ? colors[i - 1]
          : CHART_COLOR[i - 1];
      const TRANSPARENT_COLOR = SOLID_COLOR.replace('rgb', 'rgba').replace(
        ')',
        ', 0.3)'
      );
      const HOVER_COLOR = SOLID_COLOR.replace('rgb', 'rgba').replace(
        ')',
        ', 0.7)'
      );
      const AREA_COLOR = SOLID_COLOR.replace('rgb', 'rgba').replace(
        ')',
        ', 0.1)'
      );

      const CHART_DATASET: ChartDataset = {
        data: this.generateDataPropertyByColumnName(reqResponse, `v${i - 1}`),
        label: reqResponse.getColumn(i)?.displayName,
        pointRadius: 0,
        borderWidth: 1,
        animation: {
          duration: 900,
        },
        pointBackgroundColor: SOLID_COLOR,
        backgroundColor: TRANSPARENT_COLOR,
        borderColor: SOLID_COLOR,
        hoverBackgroundColor: HOVER_COLOR,
        hoverBorderColor: HOVER_COLOR,
      };
      CHART_DATASETS.push(CHART_DATASET);
    }

    return CHART_DATASETS;
  }
}

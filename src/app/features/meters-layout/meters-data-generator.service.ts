import { Injectable } from '@angular/core';
import 'chartjs-adapter-luxon';

import { ChartConfiguration, ChartDataset } from 'chart.js';

export interface Meter {
  name: string;
  link: string;
  points: Point[];
}

interface Point {
  name: string;
  value: number;
  unit: string;
}

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
  xAxisType: 'day' | 'month';
  yAxisTitle?: string;
  mainColor?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MetersDataGeneratorService {
  meterList: Meter[] = [];
  constructor() {
    this.generateMetersData();
  }

  getMetersData(): Meter[] {
    return this.meterList;
  }

  private generateMetersData() {
    for (let i = 1; i < 50; i++) {
      const name = `RGNN${this.generateRandomValue(1, 4)}/M${i}`;
      this.meterList.push({
        name: name,
        link: name.toLowerCase().replace('/', '_'),
        points: [
          {
            name: 'Moc',
            value: this.generateRandomValue(0, 22),
            unit: 'kW',
          },
          {
            name: 'Energia',
            value: this.generateRandomValue(120, 9341),
            unit: 'kWh',
          },
        ],
      });
    }
  }

  private generateRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min;
  }

  generateArraysOfData(arrLength: number, min: number, max: number): number[] {
    let arr: number[] = [];

    for (let i = 0; i < arrLength; i++) {
      arr.push(this.generateRandomValue(min, max));
    }
    return arr;
  }

  generateIncreasingArrayOfData(
    arrLength: number,
    minIncrease: number,
    maxIncrease: number
  ): number[] {
    let arr: number[] = [];

    for (let i = 0; i < arrLength; i++) {
      if (i === 0) {
        arr.push(this.generateRandomValue(minIncrease, maxIncrease));
      } else {
        arr.push(
          arr[i - 1] + this.generateRandomValue(maxIncrease, maxIncrease)
        );
      }
    }

    return arr;
  }

  generateMonthDates(count: number, year: number = 2022): Date[] {
    let dates: Date[] = [];

    for (let i = 0; i < count; i++) {
      dates.push(new Date(year, i));
    }
    return dates;
  }

  generateDayDates(count: number, month: number, year: number = 2022): Date[] {
    let dates: Date[] = [];

    for (let i = 0; i < count; i++) {
      dates.push(new Date(year, month, i));
    }

    return dates;
  }

  generate15MinuteIntervals(): Date[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const intervals: Date[] = [];
    for (let i = 0; i < 96; i++) {
      intervals.push(new Date(today.getTime() + 900000 * i));
    }
    return intervals;
  }

  generateBarChart(barOptions: BarOptions): ChartConfiguration<'bar'> {
    // const CHART_COLOR: string[] = ["rgb(255,215,0)", "rgb(29, 140, 248)", "rgb(0, 191, 154)", "rgb(236, 37, 13)", "rgb(253, 93, 147)"];
    const CHART_COLOR: string[] = [
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
    const TEXT_COLOR = 'rgba(255, 255, 255, 0.8)';
    function generateGradientStroke(
      context: any,
      options: any
    ): CanvasGradient {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      const gradientStroke = ctx.createLinearGradient(450, 400, 450, 0);
      gradientStroke.addColorStop(
        1,
        options.replace('rgb', 'rgba').replace(')', ', 1)')
      );
      gradientStroke.addColorStop(
        0,
        options.replace('rgb', 'rgba').replace(')', ', 0)')
      );
      return gradientStroke;
    }

    return {
      data: {
        labels: barOptions.labels,
        datasets: barOptions.dataset.map(
          (dataset: ChartDataset<'bar', number[]>, index) => {
            return {
              borderColor:
                index === 0 && barOptions.mainColor
                  ? barOptions.mainColor
                  : CHART_COLOR[index],
              // borderColor: "transparent",
              borderWidth: 0.2,
              backgroundColor(context: any, options: any) {
                return generateGradientStroke(
                  context,
                  index === 0 && barOptions.mainColor
                    ? barOptions.mainColor
                    : CHART_COLOR[index]
                );
              },
              hoverBackgroundColor(context: any, options: any) {
                return generateGradientStroke(
                  context,
                  index === 0 && barOptions.mainColor
                    ? barOptions.mainColor
                    : CHART_COLOR[index]
                );
              },
              hoverBorderColor(context: any, options: any) {
                return generateGradientStroke(
                  context,
                  index === 0 && barOptions.mainColor
                    ? barOptions.mainColor
                    : CHART_COLOR[index]
                );
              },
              ...dataset,
            };
          }
        ),
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        onResize(chart, size) {
          if (chart.scales['yAxis'] != undefined) {
            chart.scales['yAxis'].options.display = size.width > 700;
            chart.update();
          }
        },
        animation: {
          duration: 700,
        },
        scales: {
          yAxis: {
            type: 'linear',
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              padding: 20,
              autoSkip: true,
              maxTicksLimit: 5,
              color: TEXT_COLOR,
              callback(tickValue, index, ticks) {
                return `${tickValue} ${barOptions.yAxisUnit}`;
              },
            },
            title: {
              display: barOptions.yAxisTitle ? true : false,
              text: barOptions.yAxisTitle || '',
              font: {
                size: 16,
              },
              color: TEXT_COLOR,
            },
          },
          xAxis: {
            type: barOptions.barType === 'time' ? 'time' : 'category',
            time: {
              tooltipFormat: 'DDD',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              autoSkip: true,
              padding: 20,
              color: TEXT_COLOR,
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
            callbacks: {
              label(context) {
                let label = context.dataset.label || '';

                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label +=
                    new Intl.NumberFormat('pl').format(context.parsed.y) +
                    ` ${barOptions.yAxisUnit}`;
                }
                return label;
              },
            },
          },
          legend: {
            display: barOptions.dataset.length > 1 ? true : false,
            position: 'bottom',
            labels: {
              color: TEXT_COLOR,
            },
          },
        },
      },
      type: 'bar',
    };
  }

  generateLineChart(barOptions: LineOptions): ChartConfiguration<'line'> {
    const CHART_COLOR: string[] = [
      'rgb(255,215,0)',
      'rgb(0, 150, 255)',
      'rgb(255, 141, 114)',
      'rgb(0, 191, 154)',
      'rgb(253, 93, 147)',
    ];
    const TEXT_COLOR = 'rgba(255, 255, 255, 0.8)';
    function generateGradientStroke(
      context: any,
      options: any
    ): CanvasGradient {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      const gradientStroke = ctx.createLinearGradient(0, 80, 0, 50);
      gradientStroke.addColorStop(
        1,
        options.replace('rgb', 'rgba').replace(')', ',1.1)')
      );
      gradientStroke.addColorStop(
        0,
        options.replace('rgb', 'rgba').replace(')', ',0.2)')
      );
      return gradientStroke;
    }

    return {
      data: {
        labels: barOptions.labels,
        datasets: barOptions.dataset.map(
          (dataset: ChartDataset<'line', number[]>, index) => {
            return {
              borderColor:
                index === 0 && barOptions.mainColor
                  ? barOptions.mainColor
                  : CHART_COLOR[index],
              borderWidth: 1,
              pointRadius: 0,
              borderJoinStyle: 'round',
              tension: 0.2,
              backgroundColor(context: any, options: any) {
                return generateGradientStroke(
                  context,
                  index === 0 && barOptions.mainColor
                    ? barOptions.mainColor
                    : CHART_COLOR[index]
                );
              },
              hoverBackgroundColor(context: any, options: any) {
                return generateGradientStroke(
                  context,
                  index === 0 && barOptions.mainColor
                    ? barOptions.mainColor
                    : CHART_COLOR[index]
                );
              },
              hoverBorderColor(context: any, options: any) {
                return generateGradientStroke(
                  context,
                  index === 0 && barOptions.mainColor
                    ? barOptions.mainColor
                    : CHART_COLOR[index]
                );
              },
              ...dataset,
            };
          }
        ),
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        onResize(chart, size) {
          if (chart.scales['yAxis'] != undefined) {
            chart.scales['yAxis'].options.display = size.width > 700;
            chart.update();
          }
        },
        animation: {
          duration: 700,
        },
        scales: {
          yAxis: {
            type: 'linear',
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              padding: 20,
              autoSkip: true,
              maxTicksLimit: 5,
              color: TEXT_COLOR,
              callback(tickValue, index, ticks) {
                return `${tickValue} ${barOptions.yAxisUnit}`;
              },
            },
            title: {
              display: barOptions.yAxisTitle ? true : false,
              text: barOptions.yAxisTitle || '',
              font: {
                size: 16,
              },
              color: TEXT_COLOR,
            },
          },
          xAxis: {
            type: 'timeseries',
            // time: {
            //   unit: "minute",
            // },
            time: {
              unit: 'quarter',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              // maxTicksLimit: 24, profil dzienny
              maxTicksLimit: 4,
              padding: 20,
              color: TEXT_COLOR,
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
            enabled: false,
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
                let label = context.dataset.label || '';

                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label +=
                    new Intl.NumberFormat('pl').format(context.parsed.y) +
                    ` ${barOptions.yAxisUnit}`;
                }
                return label;
              },
            },
          },
          legend: {
            display: barOptions.dataset.length > 1 ? true : false,
            position: 'bottom',
            labels: {
              color: TEXT_COLOR,
            },
          },
        },
      },
      type: 'line',
    };
  }
}

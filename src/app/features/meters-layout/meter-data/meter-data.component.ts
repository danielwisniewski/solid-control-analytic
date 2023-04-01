import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ParamMap,
} from '@angular/router';
import { Subscription } from 'rxjs';
import {
  Meter,
  MetersDataGeneratorService,
} from '../meters-data-generator.service';

import { ChartConfiguration, ScaleOptionsByType } from 'chart.js';
import { DataTablePoint } from '../../shared-components/category-data-table/category-data-table.component';

import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-meter-data',
  templateUrl: './meter-data.component.html',
  styleUrls: ['./meter-data.component.scss'],
})
export class MeterDataComponent implements OnInit, OnDestroy {
  meterList: Meter[] = this.mdg.getMetersData();
  meter!: Meter;
  routeSub$: Subscription = new Subscription();
  selectedDateRage: number = 0;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  targetData: number[] = this.mdg.generateIncreasingArrayOfData(12, 1000, 4000);
  consumptionData: number[] = this.mdg.generateIncreasingArrayOfData(8, 1000, 4000);

  targetCons: number = this.targetData.slice(0).splice(0, 8).reduce((prev: number, next: number) => prev + next);
  realCons: number = this.consumptionData.reduce((prev: number, next: number) => prev + next);



  points: DataTablePoint[] = [
    {
      name: 'Energia',
      value: '1231531 kWh',
      isAlarm: false,
      isOverridden: false,
      isWritable: false,
    },
    {
      name: 'Moc',
      value: '12 kW',
      isAlarm: false,
      isOverridden: false,
      isWritable: false,
    },
  ];

  constructor(
    private mdg: MetersDataGeneratorService,
    private route: ActivatedRoute
  ) { }

  barChart: ChartConfiguration<'bar'> = this.mdg.generateBarChart({
    yAxisUnit: 'kWh',
    labels: this.mdg.generateDayDates(28, 1, 2023),
    barType: "time",
    xAxisType: "day",
    dataset: [
      {
        label: 'Budynek Alpha',
        data: this.mdg.generateArraysOfData(28, 312, 2821),
      },
      {
        label: "Budynek Beta",
        data: this.mdg.generateArraysOfData(28, 312, 2821),
      },
      {
        label: "Budynek Gamma",
        data: this.mdg.generateArraysOfData(28, 312, 2821),
      },
      {
        label: "Budynek Delta",
        data: this.mdg.generateArraysOfData(28, 312, 2821),
      },
      {
        label: "Budynek Epsilon",
        data: this.mdg.generateArraysOfData(28, 312, 2821),
      },
      {
        label: "Budynek Zeta",
        data: this.mdg.generateArraysOfData(28, 312, 2821),
      }
    ],
  });

  rankingBar: ChartConfiguration<'bar'> = this.mdg.generateBarChart({
    yAxisUnit: 'kWh/m²/rok',
    labels: ["Budynek Gamma", "Budynek Zeta", "Budynek Beta", "Budynek Delta", "Budynek Epsilon", "Budynek Alpha"],
    barType: "ranking",
    mainColor: "rgb(255,215,0)",
    dataset: [
      {
        label: 'KPI',
        data: this.mdg.generateArraysOfData(6, 100, 300).sort((a: number, b: number) => b - a)
      }
    ]
  })

  lineChart: ChartConfiguration<'line'> = this.mdg.generateLineChart({
    yAxisUnit: 'kW',
    labels: this.mdg.generate15MinuteIntervals(),
    xAxisType: "day",
    dataset: [
      {
        label: 'Moc czynna',
        data: [this.mdg.generateArraysOfData(24, 1, 10), this.mdg.generateArraysOfData(48, 30, 40), this.mdg.generateArraysOfData(24, 1, 10)].flat(),
      },
      {
        label: 'Moc czynna',
        data: [this.mdg.generateArraysOfData(24, 1, 10), this.mdg.generateArraysOfData(48, 30, 40), this.mdg.generateArraysOfData(24, 1, 10)].flat(),
        fill: true,
        borderWidth: 2,
      }
    ],
  });

  targetChart: ChartConfiguration<'line'> = this.mdg.generateLineChart({
    yAxisUnit: 'kWh',
    labels: this.mdg.generateMonthDates(12),
    xAxisType: "month",
    dataset: [
      {
        label: 'Plan',
        data: this.targetData,
        order: 2,
      },
      {
        label: 'Zużycie',
        data: this.consumptionData,
        fill: true,
        borderWidth: 2,
        order: 1
      }
    ],
  });

  ngOnInit(): void {
    this.routeSub$ = this.route.paramMap.subscribe((param: ParamMap) => {
      const id = param.get('id');

      this.meter = this.meterList.filter(
        (meter: Meter) => meter.link === id
      )[0];
      // this.barChart.data.datasets[0].label = this.meter.name;
    });
  }

  changeSelectedDateRange(value: number) {
    if (this.selectedDateRage != value && this.chart) {
      this.selectedDateRage = value;

      if (value === 0 && this.chart.datasets && this.chart.options?.scales) {
        this.chart.datasets[0].data = this.mdg.generateArraysOfData(
          28,
          312,
          2821
        );
        this.barChart.data.labels = this.mdg.generateDayDates(28, 1, 2023);
        this.chart.update();
      }

      if (value === 1 && this.chart.datasets && this.chart.options?.scales) {
        this.chart.datasets[0].data = this.mdg.generateArraysOfData(
          28,
          312,
          2821
        );
        this.barChart.data.labels = this.mdg.generateDayDates(31, 12, 2022);
        this.chart.update();
      }

      if (value === 2 && this.chart.datasets && this.barChart.options?.scales) {
        this.chart.datasets[0].data = this.mdg.generateArraysOfData(
          4,
          2000,
          4500
        );
        this.barChart.data.labels = this.mdg.generateMonthDates(4, 2021);
        this.chart.update();
      }

      if (value === 3 && this.chart.datasets && this.chart.options?.scales) {

        for (let i = 0; i < this.chart.datasets.length; i++) {
          this.barChart.data.datasets[i].data = this.mdg.generateArraysOfData(
            5,
            400000,
            470000
          );

        }

        this.barChart.data.labels = this.mdg.generateMonthDates(5, 2022);

        this.chart.options.scales['xAxis'] = {
          ...this.chart.options.scales['xAxis'],
          type: "timeseries",
          time: {
            unit: "month",
            tooltipFormat: "MMMM"
          }
        }

        this.chart.options.scales['yAxis'] = {
          ...this.chart.options.scales['yAxis'],
          ticks: {
            display: false
          }
        }

        this.chart.update();
      }
    }
  }

  ngOnDestroy(): void {
    this.routeSub$.unsubscribe();
  }
}

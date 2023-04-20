import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { ChartConfiguration, ChartDataset } from 'chart.js';
import { HRef, HGrid, HNum } from 'haystack-core';

import {
  BaselineOptions,
  DailyProfileModeOptions,
  DaysOptions,
  NormalizationOptions,
} from '../../enums/charts.enum';
import { TimerangeOption } from 'src/app/core/store/timerange-store.service';
import { DailyProfileLinechartService } from '../../services/daily-profile-linechart.service';
import { ChartGenerationService } from '../../services/chart-generation.service';
import { CHART_COLOR } from '../../utils/chart-utils';

@Component({
  selector: 'app-daily-profile-linechart',
  templateUrl: './daily-profile-linechart.component.html',
  styleUrls: ['./daily-profile-linechart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyProfileLinechartComponent implements OnInit, OnChanges {
  constructor(
    private chartGenerationService: ChartGenerationService,
    private chartService: DailyProfileLinechartService,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() meterId: HRef | undefined;
  @Input() activeTimerange: TimerangeOption | undefined;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  normalizationOption: NormalizationOptions[] = [];

  lineChart: ChartConfiguration | undefined;

  ngOnInit(): void {}

  ngOnChanges(change: SimpleChanges): void {
    if (change['meterId'].currentValue) this.getProfileData();
  }

  normalizationOptionChanged(option: NormalizationOptions[]) {
    this.normalizationOption = option;
    this.getProfileData();
  }

  private getProfileData() {
    this.chartService
      .fetchDailyProfileLinechart(
        this.meterId,
        this.normalizationOption,
        BaselineOptions.energyBaselinePrevYear,
        DaysOptions.all,
        DailyProfileModeOptions.dailyAverage,
        false
      )
      .subscribe((grid: HGrid) => {
        this.lineChart = this.chartGenerationService.generateChart(grid, [
          CHART_COLOR[0],
          'rgb(220,220,220)',
        ]);
        this.lineChart.type = 'line';

        if (this.lineChart.data.datasets[1]) {
          const AREA_CHART_BASELINE = this.lineChart.data
            .datasets[1] as ChartDataset<'line'>;

          AREA_CHART_BASELINE.fill = {
            target: '-1',
            below: 'rgba(255,0,0, 0.3)',
            above: 'transparent',
          };

          const AREA_CHART_PROFILE = this.lineChart.data
            .datasets[0] as ChartDataset<'line'>;

          AREA_CHART_PROFILE.fill = {
            target: 'origin',
            above: CHART_COLOR[0].replace('rgb', 'rgba').replace(')', ', 0.2)'),
          };

          this.lineChart.data.datasets[0] = AREA_CHART_PROFILE;
          this.lineChart.data.datasets[0].label = 'Profil dzienny';

          this.lineChart.data.datasets[1] = AREA_CHART_BASELINE;
          this.lineChart.data.datasets[1].borderWidth = 2;
          this.lineChart.data.datasets[1].label = 'Linia bazowa';
        }

        this.cdr.markForCheck();
      });
  }
}

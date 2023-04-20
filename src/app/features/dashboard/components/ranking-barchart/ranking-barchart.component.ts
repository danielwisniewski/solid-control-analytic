import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { HGrid, HRef } from 'haystack-core';
import { METER_TYPE } from 'src/app/core/constants/meters.const';
import { TimerangeOption } from 'src/app/core/store/timerange-store.service';
import {
  BaselineOptions,
  NormalizationOptions,
} from 'src/app/shared/charts/enums/charts.enum';
import { ChartGenerationService } from 'src/app/shared/charts/services/chart-generation.service';
import { EnergyUsageChartService } from 'src/app/shared/charts/services/energy-usage-chart.service';
import { MeterType } from 'src/app/shared/interfaces/meter-type';

@Component({
  selector: 'app-ranking-barchart',
  templateUrl: './ranking-barchart.component.html',
  styleUrls: ['./ranking-barchart.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingBarchartComponent implements OnInit, OnChanges {
  constructor(
    private chartGenerationService: ChartGenerationService,
    private energyUsageChartService: EnergyUsageChartService
  ) {}

  @Input() activeTimerange: TimerangeOption | undefined;
  @Input() siteId: HRef | undefined;

  barChart: ChartConfiguration | undefined;
  meterType: MeterType | undefined = METER_TYPE.elecMeter;
  normalizationOption: NormalizationOptions[] = [];
  isRankingChart: boolean = false;
  dataType: 'usage' | 'cost' = 'usage';

  dataGrid: HGrid | undefined;

  ngOnInit(): void {
    if (this.activeTimerange && this.siteId) this.getBarchartData();
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change['activeTimerange'] && change['activeTimerange'].currentValue) {
      this.getBarchartData();
    }
  }

  onNormalizationChanged(opts: NormalizationOptions[]): void {
    this.normalizationOption = opts;
    this.getBarchartData();
  }

  onChartTypeChanged(option: 'time' | 'ranking'): void {
    if (option === 'time') this.isRankingChart = false;
    else this.isRankingChart = true;
    this.getBarchartData();
  }

  onMeterTypeChanged(option: MeterType) {
    this.meterType = option;
    this.getBarchartData();
  }

  onDataTypeChanged(option: 'usage' | 'cost') {
    this.dataType = option;
    this.getBarchartData();
  }

  private getBarchartData(): void {
    if (this.siteId && this.meterType && this.activeTimerange) {
      this.energyUsageChartService
        .fetchEnergyUsageData(
          this.siteId,
          this.dataType === 'usage'
            ? this.meterType.energyUsagePoint
            : this.meterType.energyCostPoint,
          this.activeTimerange,
          this.normalizationOption,
          BaselineOptions.none,
          this.isRankingChart
        )
        .subscribe((grid: HGrid) => {
          this.dataGrid = grid;
          this.barChart = this.chartGenerationService.generateChart(grid);

          if (this.isRankingChart) {
            delete this.barChart.options!.scales;
            this.barChart.type = 'doughnut';
          }
        });
    }
  }
}

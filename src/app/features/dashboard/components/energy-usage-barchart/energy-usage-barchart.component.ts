import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { HRef, HGrid } from 'haystack-core';
import { TimerangeOption } from 'src/app/core/store/timerange-store.service';
import {
  BaselineOptions,
  NormalizationOptions,
} from '../../../../shared/charts/enums/charts.enum';
import { ChartGenerationService } from '../../../../shared/charts/services/chart-generation.service';
import { EnergyUsageChartService } from 'src/app/shared/charts/services/energy-usage-chart.service';
import { MeterType } from 'src/app/shared/interfaces/meter-type';

@Component({
  selector: 'app-energy-usage-barchart',
  templateUrl: './energy-usage-barchart.component.html',
  styleUrls: ['./energy-usage-barchart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnergyUsageBarchartComponent implements OnChanges {
  constructor(
    private chartGenerationService: ChartGenerationService,
    private energyUsageChartService: EnergyUsageChartService,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() siteId: HRef | undefined;
  @Input() activeTimerange: TimerangeOption | undefined;
  @Input() meterType: MeterType | undefined;

  normalizationOption: NormalizationOptions[] = [];

  barChart: ChartConfiguration | undefined;

  private dataType: 'usage' | 'cost' = 'usage';

  ngOnChanges(change: SimpleChanges): void {
    if (change['siteId'] && change['siteId'].currentValue) {
      this.getBarchartData();
    }
    if (change['activeTimerange'] && change['activeTimerange'].currentValue) {
      this.getBarchartData();
    }
  }

  onDataTypeChange(option: 'cost' | 'usage') {
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
          BaselineOptions.energyBaselinePrevMonth
        )
        .subscribe((grid: HGrid) => {
          this.barChart = this.chartGenerationService.generateChart(grid, [
            this.meterType!.color,
            'rgb(220,220,220)',
          ]);

          this.barChart.data.datasets[1].type = 'line';
          this.barChart.data.datasets[1].borderWidth = 2;
          this.cdr.markForCheck();
        });
    }
  }
}

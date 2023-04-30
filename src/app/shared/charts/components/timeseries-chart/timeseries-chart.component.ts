import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MeterType } from 'src/app/shared/interfaces/meter-type';
import { NormalizationOptions } from '../../enums/charts.enum';
import { HGrid } from 'haystack-core';
import { ChartGenerationService } from '../../services/chart-generation.service';

@Component({
  selector: 'app-timeseries-chart',
  templateUrl: './timeseries-chart.component.html',
  styleUrls: ['./timeseries-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeseriesChartComponent implements OnChanges {
  constructor(private chartGenService: ChartGenerationService) {}

  @Input() chartConfiguration: HGrid | undefined | null;
  @Input() chartTitle: string | undefined;
  @Input() normalizationRadioVisible: boolean = false;
  @Input() chartTypeOptionVisible: boolean = false;
  @Input() meterTypeOptionVisible: boolean = false;
  @Input() dataTypeOptionVisible: boolean = false;
  @Input() height: string = '30vh';
  chartConfig: ChartConfiguration | undefined;

  @Output() normalizationChanged = new EventEmitter<NormalizationOptions[]>();
  @Output() chartTypeChanged = new EventEmitter<'time' | 'ranking'>();
  @Output() meterTypeChanged = new EventEmitter<MeterType>();
  @Output() dataTypeChanged = new EventEmitter<'cost' | 'usage'>();

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnChanges(change: SimpleChanges): void {
    this.chartConfig = change['chartConfiguration'].currentValue;
    if (!!change['chartConfiguration'].currentValue) {
      if (this.chart) {
        this.chartConfig = this.chartGenService.generateChart(
          change['chartConfiguration'].currentValue
        );
        this.chart.update();
      } else {
        this.chartConfig = this.chartGenService.generateChart(
          change['chartConfiguration'].currentValue
        );
      }
    }
  }

  isSettingVisible(): boolean {
    if (
      !this.normalizationRadioVisible &&
      !this.chartTypeOptionVisible &&
      !this.meterTypeOptionVisible &&
      !this.dataTypeOptionVisible
    )
      return false;
    else return true;
  }
}

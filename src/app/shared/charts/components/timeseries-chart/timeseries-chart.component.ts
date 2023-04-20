import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MeterType } from 'src/app/shared/interfaces/meter-type';
import { NormalizationOptions } from '../../enums/charts.enum';

@Component({
  selector: 'app-timeseries-chart',
  templateUrl: './timeseries-chart.component.html',
  styleUrls: ['./timeseries-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeseriesChartComponent implements OnChanges {
  constructor(private cdr: ChangeDetectorRef) {}

  @Input() chartConfiguration: ChartConfiguration | undefined;
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
    if (change['chartConfiguration']) {
      if (this.chart) {
        this.chartConfig = change['chartConfiguration'].currentValue;
        this.chart.update();
      } else {
        this.chartConfig = change['chartConfiguration'].currentValue;
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

import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HGrid } from 'haystack-core';
import { ChartGenerationService } from '../../services/chart-generation.service';

@Component({
  selector: 'app-base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseChartComponent implements OnChanges {
  constructor(private chartGenService: ChartGenerationService) {}

  @Input() chartConfiguration: HGrid | undefined | null;
  @Input() chartTitle: string | undefined;

  @Input() height: string = '30vh';
  chartConfig: ChartConfiguration | undefined;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnChanges(change: SimpleChanges): void {
    this.chartConfig = change['chartConfiguration']?.currentValue;
    if (!!change['chartConfiguration']?.currentValue) {
      if (this.chart) {
        this.chartConfig = this.chartGenService.generateChart(
          change['chartConfiguration'].currentValue
        );
        this.chart.update();
        this.chart.render();
      } else {
        this.chartConfig = this.chartGenService.generateChart(
          change['chartConfiguration'].currentValue
        );
      }
    }
  }
}

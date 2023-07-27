import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HBool, HGrid } from 'haystack-core';
import { ChartGenerationService } from '../../services/chart-generation.service';
import { generateGradientStroke } from '../../utils/chart-utils';

@Component({
  selector: 'app-base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseChartComponent implements AfterViewInit {
  constructor(
    private chartGenService: ChartGenerationService,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() chartConfiguration: HGrid | undefined | null;

  @Input() height: string = '30vh';
  chartConfig: ChartConfiguration | undefined;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngAfterViewInit(): void {
    if (!!this.chartConfiguration?.meta.get<HBool>('gradientColor')?.value)
      this.convertToGradientColor();
    this.chart?.update();
    this.cdr.detectChanges();
  }

  ngOnChanges(change: SimpleChanges): void {
    const newValue = change['chartConfiguration']?.currentValue as
      | HGrid
      | undefined;
    // this.chartConfig = change['chartConfiguration']?.currentValue;
    if (!!newValue) {
      if (!!this.chart && !!this.chartConfig) {
        const temporary = this.chartGenService.generateChart(newValue);
        this.chart.labels = temporary.data.labels;
        this.chart.options = temporary.options;

        this.chartConfig.data.datasets = temporary.data.datasets;

        if (!!newValue.meta.get<HBool>('gradientColor')?.value)
          this.convertToGradientColor();

        this.chart!.update();
        this.cdr.detectChanges();
      } else {
        this.chartConfig = this.chartGenService.generateChart(newValue);
        if (!!newValue.meta.get<HBool>('gradientColor')?.value)
          this.convertToGradientColor();
      }
    }
  }

  private convertToGradientColor() {
    if (!!this.chartConfig && !!this.chart) {
      this.chartConfig.data.datasets?.forEach((dataset, index) => {
        if (Array.isArray(dataset.backgroundColor)) {
          const gradients = dataset.backgroundColor.map((color) =>
            generateGradientStroke(this.chart!.ctx, color)
          );
          this.chartConfig!.data.datasets![index].backgroundColor = gradients;
        } else if (typeof dataset.backgroundColor === 'string') {
          const gradient = generateGradientStroke(
            this.chart!.ctx,
            dataset.backgroundColor
          );
          this.chartConfig!.data.datasets![index].backgroundColor = gradient;
        }
      });
    }
  }
}

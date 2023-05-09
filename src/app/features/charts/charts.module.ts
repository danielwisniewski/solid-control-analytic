import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartComponent } from './components/base-chart/base-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreComponentsModule } from 'src/app/core/modules/core-components.module';

@NgModule({
  declarations: [BaseChartComponent],
  imports: [CommonModule, NgChartsModule, SharedModule, CoreComponentsModule],
  exports: [BaseChartComponent],
})
export class ChartsModule {}

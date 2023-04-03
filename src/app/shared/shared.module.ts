import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { SiteDropdownButtonComponent } from './components/site-dropdown-button/site-dropdown-button.component';
import { AppModule } from '../app.module';
import { DropdownCoreComponent } from '../core/components/dropdown-core/dropdown-core.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { TimerangeDropdownButtonComponent } from './components/timerange-dropdown-button/timerange-dropdown-button.component';
import { CardStatsComponent } from './components/card-stats/card-stats.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NormalizationRadioButtonComponent } from './charts/components/timeseries-chart/normalization-radio-button/normalization-radio-button.component';
import { DailyProfileLinechartComponent } from './charts/components/daily-profile-linechart/daily-profile-linechart.component';
import { TimeseriesChartComponent } from './charts/components/timeseries-chart/timeseries-chart.component';
import { ChartTypeRadioButtonComponent } from './charts/components/timeseries-chart/chart-type-radio-button/chart-type-radio-button.component';
import { MeterTypeRadioButtonComponent } from './charts/components/timeseries-chart/meter-type-radio-button/meter-type-radio-button.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTypeRadioButtonComponent } from './charts/components/timeseries-chart/data-type-radio-button/data-type-radio-button.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TimerangeDropdownComponent } from './components/timerange-dropdown/timerange-dropdown.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    SiteDropdownButtonComponent,
    DropdownCoreComponent,
    TimerangeDropdownButtonComponent,
    CardStatsComponent,
    LoadingSpinnerComponent,
    NormalizationRadioButtonComponent,
    DailyProfileLinechartComponent,
    TimeseriesChartComponent,
    ChartTypeRadioButtonComponent,
    MeterTypeRadioButtonComponent,
    DataTypeRadioButtonComponent,
    TimerangeDropdownComponent,
  ],
  exports: [
    FormsModule,
    NgChartsModule,
    SiteDropdownButtonComponent,
    DropdownCoreComponent,
    CollapseModule,
    BsDropdownModule,
    ToastrModule,
    TimerangeDropdownButtonComponent,
    CardStatsComponent,
    LoadingSpinnerComponent,
    NormalizationRadioButtonComponent,
    DailyProfileLinechartComponent,
    TimeseriesChartComponent,
    NgxDatatableModule,
    TimerangeDropdownComponent,
    BsDatepickerModule,
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgChartsModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule,
    NgxDatatableModule,
    BsDatepickerModule,
    ToastrModule.forRoot(),
  ],
})
export class SharedModule {}

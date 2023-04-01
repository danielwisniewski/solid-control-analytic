import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PortfolioPageComponent } from './pages/portfolio-page/portfolio-page.component';
import { SitePageComponent } from './pages/site-page/site-page.component';
import { EnergyUsageBarchartComponent } from './components/energy-usage-barchart/energy-usage-barchart.component';
import { RankingBarchartComponent } from './components/ranking-barchart/ranking-barchart.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
  declarations: [
    DashboardPageComponent,
    PortfolioPageComponent,
    SitePageComponent,
    EnergyUsageBarchartComponent,
    RankingBarchartComponent,
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    NgxDatatableModule,
  ],
})
export class DashboardModule {}

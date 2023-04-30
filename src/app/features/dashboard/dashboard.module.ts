import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { RollupSelectorComponent } from './components/rollup-selector/rollup-selector.component';
import { DashboardTopBarComponent } from './components/dashboard-top-bar/dashboard-top-bar.component';
import { DashboardTileComponent } from './components/dashboard-tile/dashboard-tile.component';
import { ChartTableToggleComponent } from './components/chart-table-toggle/chart-table-toggle.component';
@NgModule({
  declarations: [DashboardComponent, RollupSelectorComponent, DashboardTopBarComponent, DashboardTileComponent, ChartTableToggleComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MatGridListModule,
  ],
})
export class DashboardModule {}

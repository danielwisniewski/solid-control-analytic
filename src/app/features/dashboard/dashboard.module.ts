import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { RollupSelectorComponent } from './components/rollup-selector/rollup-selector.component';
import { DashboardTopBarComponent } from './components/dashboard-top-bar/dashboard-top-bar.component';
import { PagePanelComponent } from './components/page-panel/page-panel.component';
import { ChartTableToggleComponent } from './components/chart-table-toggle/chart-table-toggle.component';
import { DashboardVariableDropdownComponent } from './components/dashboard-top-bar/dashboard-variable-dropdown/dashboard-variable-dropdown.component';
import { ChartsModule } from '../charts/charts.module';
import { CoreComponentsModule } from 'src/app/core/modules/core-components.module';
import { TablesModule } from '../tables/tables.module';
import { CreatorModule } from '../creator/creator.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    DashboardComponent,
    RollupSelectorComponent,
    DashboardTopBarComponent,
    PagePanelComponent,
    ChartTableToggleComponent,
    DashboardVariableDropdownComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ChartsModule,
    DragDropModule,
    CreatorModule,
    CoreComponentsModule,
    TablesModule,
    MatGridListModule,
    BsDropdownModule,
  ],
})
export class DashboardModule {}

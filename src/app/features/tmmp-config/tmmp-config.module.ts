import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TmmpConfigRoutingModule } from './tmmp-config-routing.module';
import { TmmpConfigComponent } from './pages/tmmp-config.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MeterDataTableComponent } from './components/meter-data-table/meter-data-table.component';
import { CostCentersTableComponent } from './pages/cost-centers-table/cost-centers-table.component';

@NgModule({
  declarations: [TmmpConfigComponent, MeterDataTableComponent, CostCentersTableComponent],
  imports: [CommonModule, SharedModule, TmmpConfigRoutingModule],
})
export class TmmpConfigModule {}

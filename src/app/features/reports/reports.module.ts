import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './pages/reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreComponentsModule } from 'src/app/core/modules/core-components.module';
import { TablesModule } from '../tables/tables.module';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    CoreComponentsModule,
    TablesModule,
  ],
})
export class ReportsModule {}

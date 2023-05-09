import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TmmpConfigRoutingModule } from './tmmp-config-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';

import { CostCentersComponent } from './pages/cost-centers/cost-centers.component';
import { MeterAssignmentComponent } from './pages/meter-assignment/meter-assignment.component';
import { ConfigLayoutComponent } from './pages/config-layout/config-layout.component';
import { GasStationsComponent } from './pages/gas-stations/gas-stations.component';
import { AddCostCenterComponent } from './components/add-cost-center/add-cost-center.component';
import { CoreComponentsModule } from 'src/app/core/modules/core-components.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    CostCentersComponent,
    MeterAssignmentComponent,
    ConfigLayoutComponent,
    GasStationsComponent,
    AddCostCenterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TmmpConfigRoutingModule,
    CoreComponentsModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
  ],
})
export class TmmpConfigModule {}

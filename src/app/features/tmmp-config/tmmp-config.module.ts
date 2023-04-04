import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TmmpConfigRoutingModule } from './tmmp-config-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';

import { CostCentersComponent } from './pages/cost-centers/cost-centers.component';
import { MeterAssignmentComponent } from './pages/meter-assignment/meter-assignment.component';

@NgModule({
  declarations: [CostCentersComponent, MeterAssignmentComponent],
  imports: [CommonModule, SharedModule, TmmpConfigRoutingModule],
})
export class TmmpConfigModule {}

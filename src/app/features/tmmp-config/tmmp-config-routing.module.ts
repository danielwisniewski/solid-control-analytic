import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostCentersComponent } from './pages/cost-centers/cost-centers.component';
import { MeterAssignmentComponent } from './pages/meter-assignment/meter-assignment.component';

const routes: Routes = [
  { path: '', component: CostCentersComponent },
  { path: ':id', component: MeterAssignmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TmmpConfigRoutingModule {}

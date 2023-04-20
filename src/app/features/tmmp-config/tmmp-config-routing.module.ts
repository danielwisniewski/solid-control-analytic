import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostCentersComponent } from './pages/cost-centers/cost-centers.component';
import { MeterAssignmentComponent } from './pages/meter-assignment/meter-assignment.component';
import { ConfigLayoutComponent } from './pages/config-layout/config-layout.component';
import { LoginActivateGuard } from 'src/app/core/guards/login-activate.guard';
import { GasStationsComponent } from './pages/gas-stations/gas-stations.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigLayoutComponent,
    canActivate: [LoginActivateGuard],
    children: [
      { path: '', redirectTo: 'costCenters', pathMatch: 'full' },
      { path: 'costCenters', component: CostCentersComponent },
      { path: 'costCenters/:id', component: MeterAssignmentComponent },
      { path: 'gasStations', component: CostCentersComponent },
      { path: 'gasStations/:id', component: MeterAssignmentComponent },
      { path: 'test', component: GasStationsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TmmpConfigRoutingModule {}

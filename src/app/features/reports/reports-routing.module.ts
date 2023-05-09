import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './pages/reports.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'costCenterReport',
    pathMatch: 'full',
  },
  { path: ':type', component: ReportsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';

const routes: Routes = [
  {
    path: ':type',
    component: DashboardComponent,
  },
  {
    path: ':type/creator',
    component: DashboardComponent,
  },
  {
    path: ':type/:id',
    component: DashboardComponent,
  },
  {
    path: ':type/:id/creator',
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

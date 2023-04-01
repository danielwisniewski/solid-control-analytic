import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginActivateGuard } from '../core/guards/login-activate.guard';
import { MeterDataComponent } from './meters-layout/meter-data/meter-data.component';
import { MetersLayoutComponent } from './meters-layout/meters-layout.component';
import { MetersListComponent } from './meters-layout/meters-list/meters-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'meters',
    pathMatch: 'full',
  },
  {
    path: 'meters',
    component: MetersLayoutComponent,
    canActivate: [LoginActivateGuard],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: MetersListComponent,
      },
      {
        path: 'device/:id',
        component: MeterDataComponent,
      },
      {
        path: 'device',
        component: MeterDataComponent,
      },
      {},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

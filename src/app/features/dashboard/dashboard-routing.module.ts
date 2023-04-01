import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginActivateGuard } from 'src/app/core/guards/login-activate.guard';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { PortfolioPageComponent } from './pages/portfolio-page/portfolio-page.component';
import { SitePageComponent } from './pages/site-page/site-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    canActivate: [LoginActivateGuard],
    children: [
      {
        path: '',
        redirectTo: 'portfolio',
        pathMatch: 'full',
      },
      {
        path: 'portfolio',
        component: PortfolioPageComponent,
      },
      {
        path: 'site',
        component: SitePageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './core/auth/login-page/login-page.component';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';
import { LoginActivateGuard } from './core/guards/login-activate.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [LoginActivateGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'tmmp-config',
    component: MainLayoutComponent,
    canActivate: [LoginActivateGuard],
    loadChildren: () =>
      import('./features/tmmp-config/tmmp-config.module').then(
        (m) => m.TmmpConfigModule
      ),
  },
  {
    path: 'charts',
    component: MainLayoutComponent,
    canActivate: [LoginActivateGuard],
    loadChildren: () =>
      import('./features/ventilation/ventilation.module').then(
        (m) => m.VentilationModule
      ),
  },
  {
    path: 'reports',
    component: MainLayoutComponent,
    canActivate: [LoginActivateGuard],
    loadChildren: () =>
      import('./features/reports/reports.module').then((m) => m.ReportsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

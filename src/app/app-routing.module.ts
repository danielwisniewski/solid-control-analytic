import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './core/auth/login-page/login-page.component';
import { MainLayoutComponent } from './core/components/main-layout/main-layout.component';
import { LoginActivateGuard } from './core/guards/login-activate.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/halls',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    loadChildren: () =>
      import('./core/modules/login.module').then((m) => m.LoginModule),
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
    path: 'creator',
    canActivate: [LoginActivateGuard],
    loadChildren: () =>
      import('./features/creator/creator.module').then((m) => m.CreatorModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuBuilderComponent } from './pages/menu-builder/menu-builder.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'menu-builder',
    pathMatch: 'full',
  },
  {
    path: 'menu-builder',
    component: MenuBuilderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatorRoutingModule {}

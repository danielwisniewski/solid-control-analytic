import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentilationComponent } from './pages/ventilation.component';

const routes: Routes = [
  {
    path: ':type',
    component: VentilationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentilationRoutingModule {}

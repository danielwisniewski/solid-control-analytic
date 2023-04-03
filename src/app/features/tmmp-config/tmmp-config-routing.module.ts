import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostCentersComponent } from './pages/cost-centers/cost-centers.component';

const routes: Routes = [{ path: '', component: CostCentersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TmmpConfigRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostCentersTableComponent } from './pages/cost-centers-table/cost-centers-table.component';
import { TmmpConfigComponent } from './pages/tmmp-config.component';

const routes: Routes = [
  { path: '', component: TmmpConfigComponent },
  { path: 'table', component: CostCentersTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TmmpConfigRoutingModule {}

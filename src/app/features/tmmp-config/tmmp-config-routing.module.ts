import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TmmpConfigComponent } from './pages/tmmp-config.component';

const routes: Routes = [{ path: '', component: TmmpConfigComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TmmpConfigRoutingModule {}

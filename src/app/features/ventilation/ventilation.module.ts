import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentilationRoutingModule } from './ventilation-routing.module';
import { VentilationComponent } from './pages/ventilation.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [VentilationComponent],
  imports: [CommonModule, VentilationRoutingModule, SharedModule],
})
export class VentilationModule {}

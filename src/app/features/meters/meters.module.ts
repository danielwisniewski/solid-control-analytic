import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetersRoutingModule } from './meters-routing.module';
import { MetersComponent } from './pages/meters.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MeterTypeDropdownButtonComponent } from './components/meter-type-dropdown-button/meter-type-dropdown-button.component';

@NgModule({
  declarations: [MetersComponent, MeterTypeDropdownButtonComponent],
  imports: [CommonModule, MetersRoutingModule, SharedModule],
})
export class MetersModule {}

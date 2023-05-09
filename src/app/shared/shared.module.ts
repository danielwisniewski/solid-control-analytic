import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { CardStatsComponent } from './components/card-stats/card-stats.component';

@NgModule({
  declarations: [CardStatsComponent],
  exports: [FormsModule, CommonModule, CardStatsComponent],
  imports: [FormsModule, CommonModule],
})
export class SharedModule {}

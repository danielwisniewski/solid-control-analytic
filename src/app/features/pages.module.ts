import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MetersLayoutComponent } from './meters-layout/meters-layout.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MetersListComponent } from './meters-layout/meters-list/meters-list.component';
import { MeterDataComponent } from './meters-layout/meter-data/meter-data.component';

import { NgChartsModule } from 'ng2-charts';
import { CategoryDataTableComponent } from './shared-components/category-data-table/category-data-table.component';

@NgModule({
  declarations: [
    MetersLayoutComponent,
    MetersListComponent,
    MeterDataComponent,
    CategoryDataTableComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TabsModule,
    ModalModule,
    NgChartsModule,
  ],
})
export class PagesModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridTableComponent } from './pages/grid-table.component';
import { NumberEditColumnComponent } from './components/number-edit-column/number-edit-column.component';
import { StringEditColumnComponent } from './components/string-edit-column/string-edit-column.component';
import { GridTablePipe } from './pipes/grid-table.pipe';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreComponentsModule } from 'src/app/core/modules/core-components.module';
import { BooleanEditColumnComponent } from './components/boolean-edit-column/boolean-edit-column.component';
import { ButtonActionColumnComponent } from './components/button-action-column/button-action-column.component';
import { DeleteButtonColumnComponent } from './components/delete-button-column/delete-button-column.component';

@NgModule({
  declarations: [
    GridTableComponent,
    NumberEditColumnComponent,
    StringEditColumnComponent,
    GridTablePipe,
    BooleanEditColumnComponent,
    ButtonActionColumnComponent,
    DeleteButtonColumnComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    CoreComponentsModule,
  ],
  exports: [GridTableComponent],
})
export class TablesModule {}

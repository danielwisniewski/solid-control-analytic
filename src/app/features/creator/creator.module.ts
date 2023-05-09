import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatorRoutingModule } from './creator-routing.module';
import { MenuBuilderComponent } from './pages/menu-builder/menu-builder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PageConfigTopBarComponent } from './components/page-config-top-bar/page-config-top-bar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { PanelConfigDialogComponent } from './components/panel-config-dialog/panel-config-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    MenuBuilderComponent,
    PageConfigTopBarComponent,
    PanelConfigDialogComponent,
  ],
  imports: [
    CommonModule,
    CreatorRoutingModule,
    SharedModule,
    DragDropModule,
    CollapseModule,
    MatGridListModule,
    MatDialogModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [PageConfigTopBarComponent],
  entryComponents: [PanelConfigDialogComponent],
})
export class CreatorModule {}

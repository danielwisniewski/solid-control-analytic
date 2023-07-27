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
import { PanelConfigMainParametersComponent } from './components/panel-config-dialog/panel-config-main-parameters/panel-config-main-parameters.component';
import { PanelConfigRollupComponent } from './components/panel-config-dialog/panel-config-rollup/panel-config-rollup.component';
import { PanelConfigChartComponent } from './components/panel-config-dialog/panel-config-chart/panel-config-chart.component';
import { PanelConfigTitlesComponent } from './components/panel-config-dialog/panel-config-titles/panel-config-titles.component';
import { PanelConfigTableComponent } from './components/panel-config-dialog/panel-config-table/panel-config-table.component';
import { PanelConfigCardStatusComponent } from './components/panel-config-dialog/panel-config-card-status/panel-config-card-status.component';

@NgModule({
  declarations: [
    MenuBuilderComponent,
    PageConfigTopBarComponent,
    PanelConfigDialogComponent,
    PanelConfigMainParametersComponent,
    PanelConfigRollupComponent,
    PanelConfigChartComponent,
    PanelConfigTitlesComponent,
    PanelConfigTableComponent,
    PanelConfigCardStatusComponent,
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

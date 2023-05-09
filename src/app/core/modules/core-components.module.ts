import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownCoreComponent } from '../components/dropdown-core/dropdown-core.component';
import { FooterComponent } from '../components/footer/footer.component';
import { MainLayoutComponent } from '../components/main-layout/main-layout.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { SiteDropdownButtonComponent } from '../components/site-dropdown-button/site-dropdown-button.component';
import { TimerangeDropdownComponent } from '../components/timerange-dropdown/timerange-dropdown.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    DropdownCoreComponent,
    FooterComponent,
    MainLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    SiteDropdownButtonComponent,
    TimerangeDropdownComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule,
    // BrowserAnimationsModule,
    CollapseModule,
    BsDatepickerModule,
  ],
  exports: [
    DropdownCoreComponent,
    FooterComponent,
    MainLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    SiteDropdownButtonComponent,
    TimerangeDropdownComponent,
  ],
})
export class CoreComponentsModule {}

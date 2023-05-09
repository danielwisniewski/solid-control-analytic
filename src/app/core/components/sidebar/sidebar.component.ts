import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppStore } from '../../store/app.store.';
import { Observable, filter, map } from 'rxjs';

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  visible?: boolean;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  visible?: boolean;
  smallTitle?: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  visible?: boolean;
  smallTitle?: string;
  title?: string;
  type?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  constructor(private dashbardServ: AppStore) {}

  menuItems: Observable<RouteInfo[]> = this.dashbardServ.sidebarRoutes$.pipe(
    filter((res: RouteInfo[]) => res?.length > 0)
  );
}

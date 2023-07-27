import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { selectRoutes } from '../../store/menu/route.selectors';
import { updateRoute } from '../../store/menu/route.actions';
import { environment } from 'src/environments/environment';

export interface RouteInfo {
  path: string;
  title: string;
  type: 'link' | 'sub';
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
  type: 'link' | 'sub';
  visible?: boolean;
  smallTitle?: string;
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
  constructor(private store: Store<AppState>) {}

  sidebarLogo: string = environment.sidebarLogo;

  menuItems: Observable<RouteInfo[]> = this.store
    .select(selectRoutes)
    .pipe(filter((res: RouteInfo[]) => res?.length > 0));

  toggleCollapse(
    menuitem: RouteInfo,
    childItem: ChildrenItems | undefined = undefined
  ): void {
    let updatedRoute = { ...menuitem };

    if (!!childItem)
      updatedRoute.children = menuitem.children?.map((child) => {
        if (child.title === childItem.title) {
          return { ...child, isCollapsed: !child.isCollapsed };
        } else return child;
      });
    else updatedRoute.isCollapsed = !updatedRoute.isCollapsed;

    this.store.dispatch(
      updateRoute({ title: updatedRoute.title, updatedRoute: updatedRoute })
    );
  }
}

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, filter, tap } from 'rxjs';
import {
  ChildrenItems,
  ChildrenItems2,
  RouteInfo,
} from 'src/app/core/components/sidebar/sidebar.component';
import { AppStore } from 'src/app/core/store/app.store.';
import { MenuBuilderService } from '../../services/menu-builder.service';
import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';
import { CreatePageService } from '../../services/create-page.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { selectRoutes } from 'src/app/core/store/menu/route.selectors';
import { addRoute } from 'src/app/core/store/menu/route.actions';

@Component({
  selector: 'app-menu-builder',
  templateUrl: './menu-builder.component.html',
  styleUrls: ['./menu-builder.component.scss'],
})
export class MenuBuilderComponent implements OnInit, OnDestroy {
  constructor(
    private dashbardServ: AppStore,
    private menuService: MenuBuilderService,
    private pageCreator: CreatePageService,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.dashboardsSub.unsubscribe();
  }

  routes: RouteInfo[] = [];
  menuItems: Observable<RouteInfo[]> = this.store.select(selectRoutes).pipe(
    filter((res: RouteInfo[]) => res?.length > 0),
    tap((res) => (this.routes = res))
  );

  dashboards: PageState[] | undefined;

  dashboardsSub: Subscription = this.dashbardServ.appConfig$.subscribe(
    (res) => {
      this.dashboards = res?.dashboards;
      this.cdr.detectChanges();
    }
  );

  hasDashboard(path: string) {
    return this.dashboards?.filter((r) => {
      const pathToCompare = `/dashboard/${r.path}`;
      return pathToCompare === path || r.path === path;
    }).length;
  }

  onAddDashboard(page: RouteInfo | ChildrenItems) {
    this.pageCreator.addNewPage(page);
  }

  drop(event: CdkDragDrop<RouteInfo[]>) {
    moveItemInArray(this.routes, event.previousIndex, event.currentIndex);
  }

  onSave() {
    this.menuService.updateMenuConfig(this.routes);
  }

  onAddLink() {
    const newRoute: RouteInfo = {
      path: '/dashboard/new',
      icontype: 'tim-icons icon-chart-bar-32',
      title: 'Nazwa',
      type: 'link',
      visible: true,
    };
    this.store.dispatch(addRoute({ route: newRoute }));
  }

  onAddSubmenu() {
    const newRoute: RouteInfo = {
      path: '/dashboard',
      icontype: 'tim-icons icon-chart-bar-32',
      title: 'Nazwa',
      visible: true,
      type: 'sub',
      isCollapsed: false,
      children: [
        {
          path: 'new',
          title: 'Tytuł',
          type: 'link',
          smallTitle: 'N',
          visible: true,
        },
      ],
    };

    this.routes.push(newRoute);
  }

  dropSubmenu(event: CdkDragDrop<ChildrenItems[]>, arr: ChildrenItems[]) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
  }

  onAddChildLink(index: number) {
    const link: ChildrenItems = {
      path: 'new',
      title: 'Tytuł',
      type: 'link',
      smallTitle: 'N',
    };

    this.routes[index].children?.push(link);
  }

  onAddChildSubmenu(index: number) {
    const submenu: ChildrenItems = {
      path: 'new',
      title: 'Tytuł',
      visible: true,
      type: 'sub',
      smallTitle: 'N',
      isCollapsed: false,
      children: [
        {
          path: 'new',
          title: 'Tytuł',
          type: 'link',
          smallTitle: 'N',
          visible: true,
        },
      ],
    };

    this.routes[index].children?.push(submenu);
  }

  onAddChildChildLink(index: number, child_Index: number) {
    const link: ChildrenItems2 = {
      path: 'new',
      title: 'Tytuł',
      type: 'link',
      smallTitle: 'N',
      visible: true,
    };

    this.routes[index].children![child_Index].children!.push(link);
  }

  deleteElement(
    index: number,
    index_2: number | undefined,
    index_3: number | undefined
  ) {
    if (!!index && !!index_2 && !!index_3) {
      this.routes[index].children![index_2].children?.splice(index_3, 1);
    } else if (!!index && !!index_2) {
      this.routes[index].children!.splice(index_2, 1);
    } else if (!!index) {
      this.routes.splice(index, 1);
    }
  }
}

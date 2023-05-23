import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import { AppStore } from 'src/app/core/store/app.store.';
import { PageState } from '../interfaces/page-config.interface';
import { DashboardStore } from './dashboard.store';

@Injectable()
export class PageStoreService {
  constructor(
    private route: ActivatedRoute,
    private appStore: AppStore,
    private dashboardStore: DashboardStore
  ) {}

  activePage$: Observable<PageState | undefined> = combineLatest(
    this.route.params,
    this.appStore.appConfig$
  ).pipe(
    map(([route, appConfig]) => {
      /**
       * * Page path always starts with '/dashboard'.
       * * "Type" parameter is router parameter to identify which page should be displayed
       */
      const pagePath: string = route['type'];

      /**
       * * Details page is a page that presents data from one device.
       * * The normal page path is extended by another parameter "Id";
       * ! The full path is "/dashboard/:type/:id";
       */
      const isDetailPage: boolean = !!route['id'];
      if (!!isDetailPage) this.dashboardStore.detailsPageId$.next(route['id']);
      else this.dashboardStore.detailsPageId$.next(undefined);

      /**
       * * In the page creation module the path should be specified by word "details"
       * * what will be replaced by id of the device.
       */
      const pageRouteToFind = isDetailPage ? `${pagePath}/details` : pagePath;

      const pageConfig = appConfig?.dashboards?.find(
        (dashboard: PageState) => dashboard.path == pageRouteToFind
      );

      this.dashboardStore.triggerFetchingDataForPanels(pageConfig);

      return pageConfig;
    })
  );
}

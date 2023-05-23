import { ActionReducerMap } from '@ngrx/store';
import { SiteState, siteReducer } from '../core/store/sites/site.reducer';
import { RouteState, routeReducer } from '../core/store/menu/route.reducer';

import {
  TimerangeState,
  timerangeReducer,
} from '../core/store/timerange/timerange.reducer';
import { RouterState } from '../core/store/router/router.reducer';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { PagesState, pagesReducer } from '../core/store/pages/pages.reducer';

export interface AppState {
  site: SiteState;
  menu: RouteState;
  timerange: TimerangeState;
  router: RouterReducerState<any>;
  pages: PagesState;
}

export const appReducer: ActionReducerMap<AppState> = {
  site: siteReducer,
  menu: routeReducer,
  timerange: timerangeReducer,
  router: routerReducer,
  pages: pagesReducer,
};

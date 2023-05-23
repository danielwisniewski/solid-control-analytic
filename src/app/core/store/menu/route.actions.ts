import { createAction, props } from '@ngrx/store';
import { RouteInfo } from '../../components/sidebar/sidebar.component';

// Action to add a route
export const addRoute = createAction(
  '[Route] Add Route',
  props<{ route: RouteInfo }>()
);

// Action to remove a route
export const removeRoute = createAction(
  '[Route] Remove Route',
  props<{ path: string }>()
);

// Action to update a route
export const updateRoute = createAction(
  '[Route] Update Route',
  props<{ title: string; updatedRoute: RouteInfo }>()
);

// Action to generate new routes array with a constructor
export const generateRoutes = createAction(
  '[Route] Generate Routes',
  props<{ routeInfos: RouteInfo[] }>()
);

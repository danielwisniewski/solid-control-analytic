import { createReducer, on } from '@ngrx/store';
import {
  addRoute,
  generateRoutes,
  removeRoute,
  updateRoute,
} from './route.actions';
import { RouteInfo } from '../../components/sidebar/sidebar.component';

export interface RouteState {
  routes: RouteInfo[];
}

const initialState: RouteState = {
  routes: [],
};

export const routeReducer = createReducer(
  initialState,
  on(addRoute, (state, { route }) => ({
    ...state,
    routes: [...state.routes, route],
  })),
  on(removeRoute, (state, { path }) => ({
    ...state,
    routes: state.routes.filter((route) => route.path !== path),
  })),
  on(updateRoute, (state, { title: title, updatedRoute }) => ({
    ...state,
    routes: state.routes.map((route) => {
      if (route.title === title) {
        return { ...route, ...updatedRoute };
      }
      return route;
    }),
  })),
  on(generateRoutes, (state, { routeInfos }) => ({
    ...state,
    routes: routeInfos.slice(),
  }))
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouteState } from './route.reducer';

export const selectRouteState = createFeatureSelector<RouteState>('menu');

export const selectRoutes = createSelector(
  selectRouteState,
  (state) => state.routes
);

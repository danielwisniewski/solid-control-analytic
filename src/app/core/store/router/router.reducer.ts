import { RouterReducerState, getSelectors } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectPages } from '../pages/pages.selectors';

export interface RouterState {
  router: RouterReducerState<any>;
}

export const selectRouter = createFeatureSelector<
  RouterState,
  RouterReducerState<any>
>('router');

const {
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
} = getSelectors(selectRouter);

export const selectPagePath = selectRouteParam('type');

export const selectDetailsPageId = selectRouteParam('id');

export const selectPageUrl = selectUrl;

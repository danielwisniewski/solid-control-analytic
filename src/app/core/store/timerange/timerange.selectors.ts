import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TimerangeState } from './timerange.reducer';
import { selectActivePage } from '../pages/pages.selectors';

export const selectTimerangeState =
  createFeatureSelector<TimerangeState>('timerange');

export const selectActiveTimerange = createSelector(
  selectTimerangeState,
  (state) => state.activeTimerange
);

export const selectTimerangeConfiguration = createSelector(
  selectActivePage,
  (state) => state?.datepicker
);

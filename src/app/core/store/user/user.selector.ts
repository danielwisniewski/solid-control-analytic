import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectActiveUsername = createSelector(
  selectUserState,
  (state) => state.username
);
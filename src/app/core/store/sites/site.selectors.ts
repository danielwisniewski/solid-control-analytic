import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HDict, HRef } from 'haystack-core';
import { SiteState } from './site.reducer';

export const selectSiteState = createFeatureSelector<SiteState>('site');

export const selectSites = createSelector(
  selectSiteState,
  (state) => state.sites
);

export const selectActiveSite = createSelector(
  selectSiteState,
  (state) => state.activeSite
);

export const selectActiveSiteId = createSelector(selectSiteState, (state) =>
  state.activeSite?.get<HRef>('id')?.toZinc(true)
);

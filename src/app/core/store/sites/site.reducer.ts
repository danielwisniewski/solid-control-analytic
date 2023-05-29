import { createReducer, on } from '@ngrx/store';
import { HDict, HGrid } from 'haystack-core';
import * as SiteActions from './site.actions';

export interface SiteState {
  sites: HGrid<HDict> | undefined;
  activeSite: HDict | undefined;
}

export const initialState: SiteState = {
  sites: undefined,
  activeSite: undefined,
};

export const siteReducer = createReducer(
  initialState,
  on(SiteActions.updateSites, (state, { sites }) => {
    if (!!sites && !localStorage.getItem('site')) {
      const firstSite = sites.first;
      return {
        ...state,
        sites: sites,
        activeSite: firstSite,
      };
    } else if (!!sites && !!localStorage.getItem('site')) {
      const activeSite = HDict.make(
        JSON.parse(localStorage.getItem('site') as string)
      );
      return {
        ...state,
        sites: sites,
        activeSite: activeSite,
      };
    }
    return {
      ...state,
      sites: sites,
    };
  }),
  on(SiteActions.changeActiveSite, (state, { site }) => {
    return { ...state, activeSite: site };
  })
);

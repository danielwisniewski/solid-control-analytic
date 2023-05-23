import { createAction, props } from '@ngrx/store';
import { HDict, HGrid } from 'haystack-core';

export const updateSites = createAction(
  '[Site] Update Sites',
  props<{ sites: HGrid<HDict> | undefined }>()
);
export const changeActiveSite = createAction(
  '[Site] Change Active Site',
  props<{ site: HDict }>()
);

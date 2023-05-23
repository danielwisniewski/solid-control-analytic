import { createAction, props } from '@ngrx/store';

export const setActiveTimerange = createAction(
  '[Timerange] Set Active Timerange',
  props<{ dates: string }>()
);

import { createAction, props } from '@ngrx/store';

export const setUsername = createAction(
  '[User] Assign active username',
  props<{ username: string }>()
);

import { createAction, props } from '@ngrx/store';
import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';

export const loadPages = createAction(
  '[Pages] Load pages configuration from API',
  props<{ pages: PageState[] }>()
);

export const changeCreatorModeState = createAction(
  '[Pages] Change creator mode state',
  props<{ status: boolean }>()
);

export const changeDetailsPageState = createAction(
  '[Pages] Change details page state',
  props<{ id: string | undefined }>()
);

export const changeActivePageIndex = createAction(
  '[Pages] Change active page',
  props<{ index: number }>()
);

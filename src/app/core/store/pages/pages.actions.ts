import { createAction, props } from '@ngrx/store';
import { HGrid } from 'haystack-core';
import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';

export const loadPages = createAction(
  '[Pages] Load Pages Configuration',
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
  '[Pages] Set index of pages array pointing out active page',
  props<{ index: number }>()
);

export const changeActivePanelIndex = createAction(
  '[Pages] Set active panel index in array',
  props<{ id: number }>()
);

export const changePanelParameters = createAction(
  '[Pages] Change panel rollup option',
  props<{ parameter: string; value: any }>()
);

export const fetchPanelData = createAction(
  '[Pages] Fetch active panel data',
  props<{ id: number }>()
);

export const fetchPanelsData = createAction('[Pages] Fetch all panels data');

export const setPanelData = createAction(
  '[Pages] Set fetched panel data',
  props<{
    data: { pageIndex: number; panelId: number; panelData: HGrid | undefined };
  }>()
);

export const changePanelType = createAction(
  '[Pages] Change panel type',
  props<{
    panelType: string;
  }>()
);

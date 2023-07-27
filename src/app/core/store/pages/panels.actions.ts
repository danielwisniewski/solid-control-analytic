import { createAction, props } from '@ngrx/store';
import { HGrid } from 'haystack-core';
import { Panel } from 'src/app/features/dashboard/interfaces/panel.interface';

export const changeActivePanelId = createAction(
  '[Pages] Set active panel id',
  props<{ id: string | undefined }>()
);

export const changePanelParameters = createAction(
  '[Pages] Change panel parameter option',
  props<{ panelId: string; parameter: string; value: any }>()
);

export const fetchPanelData = createAction(
  '[Pages] Fetch active panel data',
  props<{ id: string }>()
);

export const fetchActivePanelData = createAction(
  '[Pages] Fetch active panel data'
);

export const setPanelData = createAction(
  '[Pages] Set fetched panel data',
  props<{
    data: { panelId: string; panelData: HGrid | undefined };
  }>()
);

export const updatePanelConfig = createAction(
  '[Pages] Update panel configuration from creator module',
  props<{ panel: Panel }>()
);

export const changePanelOrder = createAction(
  '[Pages] Change panels order',
  props<{ panels: Panel[] }>()
);

export const changePanelConfiguration = createAction(
  '[Pages] Change panel configuration',
  props<{
    panelId: string;
    propertyName: string;
    value: any;
  }>()
);

export const copyPanelConfiguration = createAction(
  '[Pages] Copy panel configuration',
  props<{ panel: Panel }>()
);

export const pastePanelConfiguration = createAction(
  '[Pages] Paste panel configuration'
);

export const deletePanel = createAction(
  '[Pages] Delete panel by id',
  props<{ id: string }>()
);

export const downloadPanelReport = createAction(
  '[Pages] Download panel report by id',
  props<{ id: string }>()
);

export const addNewPanel = createAction(
  '[Pages] Add new panel on the page',
  props<{ panel: Panel }>()
);

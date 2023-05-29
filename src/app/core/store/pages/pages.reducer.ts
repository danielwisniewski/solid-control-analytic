import { createReducer, on } from '@ngrx/store';
import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';
import * as PagesActions from './pages.actions';
import {
  modifyPanelData,
  modifyPanelConfiguration,
  modifyPanelParameters,
} from './pages.utils';
import {
  changeActivePanelIndex,
  setPanelData,
  changePanelType,
  changePanelParameters,
} from './panels.actions';

export interface PagesState {
  pagesConfig: PageState[] | undefined;
  isCreatorMode: boolean;
  detailsPageId: string | undefined;
  activePageIndex: number;
  activePanelId: number;
  activePanelIndex: number;
}

export const initialState: PagesState = {
  pagesConfig: undefined,
  isCreatorMode: false,
  detailsPageId: undefined,
  activePageIndex: -1,
  activePanelId: -1,
  activePanelIndex: -1,
};

export const pagesReducer = createReducer(
  initialState,
  on(PagesActions.loadPages, (state, { pages }) => {
    return {
      ...state,
      pagesConfig: pages,
    };
  }),
  on(PagesActions.changeActivePageIndex, (state, { index }) => {
    return {
      ...state,
      activePageIndex: index,
    };
  }),
  on(changeActivePanelIndex, (state, { id }) => {
    if (!!state.pagesConfig && state.activePageIndex > -1) {
      const panelIndex = state.pagesConfig[
        state.activePageIndex
      ].layout.tiles.findIndex((tile) => tile.tile === id);

      return {
        ...state,
        activePanelId: id,
        activePanelIndex: panelIndex,
      };
    }
    return {
      ...state,
      activePanelIndex: -1,
      activePanelId: -1,
    };
  }),
  on(PagesActions.changeCreatorModeState, (state, { status }) => {
    return {
      ...state,
      isCreatorMode: status,
    };
  }),
  on(setPanelData, (state, { data }) => {
    return modifyPanelData(state, data);
  }),
  on(changePanelType, (state, { panelType }) => {
    return modifyPanelConfiguration(state, 'type', panelType);
  }),
  on(changePanelParameters, (state, { parameter, value }) => {
    return modifyPanelParameters(state, parameter, value);
  })
);

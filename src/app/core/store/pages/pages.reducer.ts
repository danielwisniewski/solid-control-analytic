import { createReducer, on, select } from '@ngrx/store';
import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';
import * as PagesActions from './pages.actions';
import {
  ColumnConfiguration,
  RollupOption,
} from 'src/app/features/dashboard/interfaces/panel.interface';
import { modifyPanelData, modifyPanelConfiguration } from './pages.utils';
import { selectActivePage } from './pages.selectors';

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
  on(PagesActions.changeActivePanelIndex, (state, { id }) => {
    if (!!state.pagesConfig && state.activePageIndex > -1) {
      const panelIndex = state.pagesConfig[
        state.activePageIndex
      ].layout.tiles.findIndex((tile) => tile.tile === id);
      return {
        ...state,
        activePanelIndex: panelIndex,
        activePanelId: id,
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
  on(PagesActions.setPanelData, (state, { data }) => {
    return modifyPanelData(state, data);
  }),
  on(PagesActions.changePanelType, (state, { panelType }) => {
    return modifyPanelConfiguration(state, 'type', panelType);
  }),
  on(PagesActions.changePanelParameters, (state, { parameter, value }) => {
    return modifyPanelConfiguration(state, parameter, value);
  })
);

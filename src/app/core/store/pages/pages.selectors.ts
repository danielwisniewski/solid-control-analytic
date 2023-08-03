import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PagesState } from './pages.reducer';
import { selectPagePath } from '../router/router.reducer';

export const selectPagesState = createFeatureSelector<PagesState>('pages');

export const selectPages = createSelector(
  selectPagesState,
  (state) => state.pagesConfig
);

export const selectActivePage = createSelector(selectPagesState, (pages) =>
  pages.pagesConfig?.find((page) => page.scId === pages.activePageId)
);

export const selectActivePanel = createSelector(selectPagesState, (state) => {
  const activePage = state.pagesConfig?.find(
    (page) => page.scId === state.activePageId
  );
  return activePage?.layout.tiles.find(
    (tile) => tile.panelId === state.activePanelId
  );
});

export const isCreatorMode = createSelector(
  selectPagesState,
  (state) => state.isCreatorMode
);

export const selectDetailsPageId = createSelector(
  selectPagesState,
  (state) => state.detailsPageId
);

export const selectSkysparkFunc = createSelector(
  selectActivePage,
  (page) => page?.skysparkFunc
);

export const selectActiveVariable = createSelector(
  selectActivePage,
  (state) => state?.activeVariables
);

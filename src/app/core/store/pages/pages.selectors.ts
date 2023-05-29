import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PagesState } from './pages.reducer';
import { selectPagePath } from '../router/router.reducer';

export const selectPagesState = createFeatureSelector<PagesState>('pages');

export const selectPages = createSelector(
  selectPagesState,
  (state) => state.pagesConfig
);

export const selectActivePage = createSelector(
  selectPages,
  selectPagePath,
  (pages, path) => pages?.find((page) => page.path === path)
);

export const selectActivePageIndex = createSelector(
  selectPages,
  selectPagePath,
  (pages, path) => pages?.findIndex((page) => page.path === path)
);

export const selectActivePanel = createSelector(
  selectPagesState,
  selectActivePage,
  (state, page) =>
    page?.layout.tiles.find((tile) => tile.tile === state.activePanelIndex)
);

export const selectPanelById = (id: number) =>
  createSelector(selectActivePage, (page) =>
    page?.layout.tiles.find((tile) => tile.tile === id)
  );

export const isCreatorMode = createSelector(
  selectPagesState,
  (state) => state.isCreatorMode
);

export const selectDetailsPageId = createSelector(
  selectPagesState,
  (state) => state.detailsPageId
);

export const selectSkysparkFunc = createSelector(
  selectPages,
  selectPagePath,
  (pages, path) => pages?.find((page) => page.path === path)?.skysparkFunc
);

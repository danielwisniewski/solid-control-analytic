import { ColumnConfiguration } from 'src/app/features/dashboard/interfaces/panel.interface';
import { PagesState } from './pages.reducer';
import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';

export function modifyPanelData(state: PagesState, data: any) {
  const { pageIndex, panelId, panelData } = data;
  const { pagesConfig } = state;

  if (pageIndex > -1 && pagesConfig && pagesConfig.length > pageIndex) {
    const updatedPagesConfig = [...pagesConfig];
    const page = { ...updatedPagesConfig[pageIndex] };
    const tileIndex = page.layout.tiles.findIndex(
      (tile) => tile.tile === panelId
    );

    if (page.layout.tiles.length > panelId) {
      const meta = page.layout.tiles[tileIndex].meta as any;
      const columnsMeta = page.layout.tiles[tileIndex]
        .columnsMeta as ColumnConfiguration[];

      if (!!panelData) {
        panelData.meta.update(meta);

        columnsMeta?.forEach((columnMeta) => {
          for (const meta in columnMeta) {
            panelData
              .getColumn(columnMeta.columnName)
              ?.meta.set(meta, columnMeta[meta]);
          }
        });
      }

      const updatedTile = {
        ...page.layout.tiles[tileIndex],
        panelData: panelData,
      };
      const updatedTiles = [...page.layout.tiles];
      updatedTiles[tileIndex] = updatedTile;
      page.layout = { ...page.layout, tiles: updatedTiles };
      updatedPagesConfig[pageIndex] = page;

      return {
        ...state,
        pagesConfig: updatedPagesConfig,
      };
    }
  }
  return { ...state };
}

export function modifyPanelConfiguration(
  state: PagesState,
  property: string,
  value: any
) {
  if (
    state.activePageIndex > -1 &&
    !!state.pagesConfig &&
    state.activePanelIndex > -1
  ) {
    let updatedPagesConfig = [...state.pagesConfig];

    const currentPageConfig: PageState =
      updatedPagesConfig[state.activePageIndex];

    const updatedTiles = currentPageConfig.layout.tiles.map((tile, index) => {
      if (index === state.activePanelIndex) {
        return { ...tile, [property]: value as any };
      }
      return tile;
    });

    const updatedPageConfig: PageState = {
      ...currentPageConfig,
      layout: {
        ...currentPageConfig.layout,
        tiles: updatedTiles,
      },
    };

    updatedPagesConfig[state.activePageIndex] = updatedPageConfig;

    return {
      ...state,
      pagesConfig: updatedPagesConfig,
    };
  }

  return {
    ...state,
  };
}

export function modifyPanelParameters(
  state: PagesState,
  property: string,
  value: any
) {
  if (
    state.activePageIndex > -1 &&
    !!state.pagesConfig &&
    state.activePanelIndex > -1
  ) {
    let updatedPagesConfig = [...state.pagesConfig];

    const currentPageConfig: PageState =
      updatedPagesConfig[state.activePageIndex];

    const updatedTiles = currentPageConfig.layout.tiles.map((tile, index) => {
      if (index === state.activePanelIndex) {
        return {
          ...tile,
          parameters: {
            ...tile.parameters,
            [property]: value,
          },
        };
      }
      return tile;
    });

    const updatedPageConfig: PageState = {
      ...currentPageConfig,
      layout: {
        ...currentPageConfig.layout,
        tiles: updatedTiles,
      },
    };

    updatedPagesConfig[state.activePageIndex] = updatedPageConfig;

    return {
      ...state,
      pagesConfig: updatedPagesConfig,
    };
  }

  return {
    ...state,
    activePanelIndex: -1,
  };
}

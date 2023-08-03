import { createReducer, on } from '@ngrx/store';
import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';
import * as PagesActions from './pages.actions';
import {
  setPanelData,
  changePanelConfiguration,
  changePanelParameters,
  updatePanelConfig,
  changeActivePanelId,
  changePanelOrder,
  copyPanelConfiguration,
  deletePanel,
  pastePanelConfiguration,
  addNewPanel,
} from './panels.actions';
import { Panel } from 'src/app/features/dashboard/interfaces/panel.interface';

export interface PagesState {
  pagesConfig: PageState[] | undefined;
  isCreatorMode: boolean;
  detailsPageId: string | undefined;
  activePageId: string | undefined;
  activePanelId: string | undefined;
  copiedPanelConfiguration: Panel | undefined;
  isSaveRequired: boolean;
}

export const initialState: PagesState = {
  pagesConfig: undefined,
  isCreatorMode: false,
  detailsPageId: undefined,
  activePageId: undefined,
  activePanelId: undefined,
  copiedPanelConfiguration: undefined,
  isSaveRequired: false,
};

export const pagesReducer = createReducer(
  initialState,
  on(PagesActions.loadPages, (state, { pages }) => {
    const pagesWithAddedId = pages.map((page) => ({
      ...page,
      layout: {
        ...page.layout,
        tiles: page.layout.tiles.map((tile) => {
          if (!!tile.panelId && !!tile.meta?.panelId) return tile;
          const id = Math.random().toString(36).slice(2);
          return {
            ...tile,
            panelId: id,
            meta: {
              ...tile.meta,
              panelId: id,
            },
          };
        }),
      },
    }));

    return {
      ...state,
      pagesConfig: pagesWithAddedId,
    };
  }),
  on(PagesActions.changeActivePageId, (state, { index }) => {
    return {
      ...state,
      activePageId: index,
    };
  }),
  on(changeActivePanelId, (state, { id }) => {
    return {
      ...state,
      activePanelId: id,
    };
  }),
  on(PagesActions.changeCreatorModeState, (state, { status }) => {
    return {
      ...state,
      isCreatorMode: status,
    };
  }),
  on(PagesActions.changeDetailsPageState, (state, { id }) => {
    return {
      ...state,
      detailsPageId: id,
    };
  }),
  on(setPanelData, (state, { data }) => {
    const { panelId, panelData } = data;
    let updatedState = { ...state };
    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => {
        return {
          ...page,
          layout: {
            ...page.layout,
            tiles: page.layout.tiles.map((tile) => {
              if (tile.panelId === panelId) {
                if (!!panelData && !!tile.meta)
                  panelData?.meta.update(tile.meta as any);
                if (!!panelData && !!tile.columnsMeta)
                  tile.columnsMeta?.forEach((columnMeta) => {
                    for (const meta in columnMeta) {
                      panelData
                        .getColumn(columnMeta.columnName)
                        ?.meta.set(meta, columnMeta[meta]);
                    }
                  });
                return { ...tile, panelData: panelData };
              } else return tile;
            }),
          },
        };
      }),
    };

    return {
      ...updatedState,
    };
  }),
  on(changePanelConfiguration, (state, { panelId, propertyName, value }) => {
    let updatedState = { ...state };
    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => ({
        ...page,
        layout: {
          ...page.layout,
          tiles: page.layout.tiles.map((tile) => {
            if (tile.panelId === panelId)
              return { ...tile, [propertyName]: value };
            else return tile;
          }),
        },
      })),
    };
    return {
      ...updatedState,
    };
  }),
  on(changePanelParameters, (state, { panelId, parameter, value }) => {
    let updatedState = { ...state };
    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => ({
        ...page,
        layout: {
          ...page.layout,
          tiles: page.layout.tiles.map((tile) => {
            if (tile.panelId === panelId)
              return {
                ...tile,
                parameters: { ...tile.parameters, [parameter]: value },
              };
            else return tile;
          }),
        },
      })),
    };
    return {
      ...updatedState,
    };
  }),
  on(PagesActions.changePageVariable, (state, { name, val, dis }) => {
    const activePageId = state.activePageId;

    let updatedState = { ...state };
    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => {
        if (page.scId !== activePageId) return page;
        if (!page.activeVariables) page = { ...page, activeVariables: [] };

        const variableIndex = page.activeVariables?.findIndex(
          (variable) => variable.name === name
        );
        if (variableIndex === -1) {
          page.activeVariables?.push({
            name: name,
            dis: dis,
            val: val,
          } as any);
          page = {
            ...page,
          };
        } else {
          page.activeVariables?.map((variable) => {
            if (variable.name === name) return { ...variable, val: val };
            else return variable;
          });
        }
        return page;
      }),
    };
    return {
      ...updatedState,
    };
  }),
  on(updatePanelConfig, (state, { panel }) => {
    let updatedState = { ...state };
    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => {
        return {
          ...page,
          layout: {
            ...page.layout,
            tiles: page.layout.tiles.map((tile) => {
              if (tile.panelId === state.activePanelId) {
                return panel;
              } else return tile;
            }),
          },
        };
      }),
    };

    return {
      ...updatedState,
      isSaveRequired: true,
    };
  }),
  on(changePanelOrder, (state, { panels }) => {
    if (!panels) return { ...state };

    let updatedState = { ...state };

    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => {
        if (page.scId === state.activePageId) {
          return {
            ...page,
            layout: {
              ...page.layout,
              tiles: [...panels],
            },
          };
        } else return page;
      }),
    };

    return {
      ...updatedState,
    };
  }),
  on(copyPanelConfiguration, (state, { panel }) => {
    const panelConfig = { ...panel };

    if (!!panelConfig) {
      delete panelConfig.panelData;
      delete panelConfig.panelId;
      return {
        ...state,
        copiedPanelConfiguration: panelConfig,
      };
    }

    return { ...state };
  }),
  on(deletePanel, (state, { id }) => {
    let updatedState = { ...state };

    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => ({
        ...page,
        layout: {
          ...page.layout,
          tiles: page.layout.tiles.filter((tile) => tile.panelId !== id),
        },
      })),
    };

    return {
      ...updatedState,
      isSaveRequired: true,
    };
  }),
  on(pastePanelConfiguration, (state) => {
    let updatedState = { ...state };

    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => ({
        ...page,
        layout: {
          ...page.layout,
          tiles: page.layout.tiles.map((tile) => {
            if (
              tile.panelId === updatedState.activePanelId &&
              !!updatedState.copiedPanelConfiguration
            ) {
              return {
                ...updatedState.copiedPanelConfiguration,
                panelId: tile.panelId,
                tile: tile.tile,
                panelData: tile.panelData,
              };
            } else return tile;
          }),
        },
      })),
    };

    return { ...updatedState };
  }),
  on(PagesActions.savePageConfiguration, (state) => {
    return {
      ...state,
      isSaveRequired: false,
    };
  }),
  on(PagesActions.updatePageConfig, (state, { config }) => {
    let updatedState = { ...state };

    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => {
        if (page.scId === state.activePageId) {
          return config;
        } else return page;
      }),
    };

    return {
      ...updatedState,
      isSaveRequired: true,
    };
  }),
  on(addNewPanel, (state, { panel }) => {
    let updatedState = { ...state };

    updatedState = {
      ...updatedState,
      pagesConfig: updatedState.pagesConfig?.map((page) => {
        if (page.scId === updatedState.activePageId) {
          return {
            ...page,
            layout: {
              ...page.layout,
              tiles: [...page.layout.tiles, panel],
            },
          };
        } else return page;
      }),
    };

    return { ...updatedState, isSaveRequired: true };
  })
);

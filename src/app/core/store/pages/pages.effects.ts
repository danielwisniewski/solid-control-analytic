import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import {
  changeActivePageId,
  changePageVariable,
  fetchAllPanelsData,
  loadPages,
  savePageConfiguration,
} from './pages.actions';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  of,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  selectActivePage,
  selectPagesState,
  selectSkysparkFunc,
} from './pages.selectors';
import { selectPagePath, selectDetailsPageId } from '../router/router.reducer';
import { selectActiveSiteId } from '../sites/site.selectors';
import { selectActiveTimerange } from '../timerange/timerange.selectors';
import { RequestReadService } from '../../services/requests/read/request-read.service';
import { queryToZinc } from '../../functions/utils';
import { HGrid } from 'haystack-core';
import {
  fetchPanelData,
  setPanelData,
  changePanelParameters,
  changeActivePanelId,
  fetchActivePanelData,
  updatePanelConfig,
  copyPanelConfiguration,
  downloadPanelReport,
} from './panels.actions';
import { setActiveTimerange } from '../timerange/timerange.actions';

@Injectable()
export class PagesEffects {
  onLoadPages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadPages),
        withLatestFrom(
          this.store.select(selectPagePath),
          this.store.select(selectDetailsPageId)
        ),
        tap(([pages, route, detailsPage]) => {
          this.store.dispatch(setActiveTimerange({ dates: '' }));
          const pageToFind = !!detailsPage ? `${route}/details` : route;
          const activePage = pages.pages.find(
            (page) => page.path === pageToFind
          );
          if (!activePage) return;
          this.store.dispatch(changeActivePageId({ index: activePage?.scId }));

          if (!!localStorage.getItem('copiedPanel')) {
            const panel = JSON.parse(localStorage.getItem('copiedPanel')!);
            this.store.dispatch(copyPanelConfiguration({ panel: panel }));
          }
        })
      ),
    { dispatch: false }
  );

  onFetchActivePanelData = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchActivePanelData),
        withLatestFrom(this.store.select(selectPagesState)),
        tap(([action, state]) => {
          if (!!state.activePanelId)
            this.store.dispatch(fetchPanelData({ id: state.activePanelId }));
        })
      ),
    { dispatch: false }
  );

  onFetchAllPanelsData = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchAllPanelsData),
        withLatestFrom(this.store.select(selectActivePage)),
        tap(([action, page]) => {
          page?.layout.tiles.forEach((tile) => {
            if (!!tile.panelId)
              this.store.dispatch(fetchPanelData({ id: tile.panelId }));
          });
        })
      ),
    { dispatch: false }
  );

  onFetchPanelData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchPanelData, downloadPanelReport),
        withLatestFrom(
          this.store.select(selectActiveSiteId),
          this.store.select(selectSkysparkFunc),
          this.store.select(selectActiveTimerange),
          this.store.select(selectActivePage),
          this.store.select(selectPagesState)
        ),
        // tap(([action, activeSite, skysparkFunc, timerange, page, state]) =>
        //   console.log(action)
        // ),
        filter(
          ([action, activeSite, skysparkFunc, timerange, page, state]) =>
            !!activeSite &&
            !!skysparkFunc &&
            !!timerange &&
            !!action.id &&
            timerange !== 'processing...'
        ),
        map(([action, activeSite, skysparkFunc, timerange, page, state]) => {
          const activePanel = page?.layout.tiles.find(
            (tile) => tile.panelId === action.id
          );

          let parameters = { ...activePanel?.parameters } ?? {};

          if (!!state.detailsPageId)
            parameters = { ...parameters, detailsPageId: state.detailsPageId };

          let reqParameters: string[] = [];

          if (!!page?.variables)
            reqParameters = page?.variables?.map((vars) => `var-${vars.name}`);

          if (!!activePanel?.meta?.skipUpdateOnVariableChange)
            reqParameters = [];

          if (!!activePanel?.hasRollupSelector) reqParameters?.push('rollup');

          const isQueryValid = reqParameters.every((param) =>
            Object.keys(parameters).includes(param)
          );

          if (!isQueryValid) return;

          const jsonParameters =
            Object.keys(parameters).length > 0
              ? `, ${JSON.stringify(parameters)}`
              : '';
          return {
            query: `${skysparkFunc}(${activePanel?.tile},${timerange},${activeSite}${jsonParameters})`,
            panelId: action.id,
            action: action.type,
          };
        }),
        filter((res) => !!res),
        tap((query) => {
          if (query!.action === '[Pages] Fetch panel data by Id') {
            this.store.dispatch(
              setPanelData({
                data: {
                  panelId: query!.panelId,
                  panelData: undefined,
                },
              })
            );
          }
        }),
        mergeMap((query) => {
          if (query!.action === '[Pages] Fetch panel data by Id') {
            return this.req.readExprAll(queryToZinc(query!.query)).pipe(
              withLatestFrom(this.store.select(selectPagesState)),
              tap(([res, state]) => {
                this.store.dispatch(
                  setPanelData({
                    data: {
                      panelId: query!.panelId,
                      panelData: HGrid.make(res),
                    },
                  })
                );
              })
            );
          } else {
            const VIEW_NAME = 'tableReport';
            const STATE = `{ funcData: ${queryToZinc(query!.query)} }`;
            this.req.generateExportRequest(VIEW_NAME, STATE, 'Report');
            return of(undefined);
          }
        })
      ),
    { dispatch: false }
  );

  onParameterChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changePanelParameters),
        tap(() => {
          this.store.dispatch(changeActivePanelId({ id: undefined }));
        })
      ),
    { dispatch: false }
  );

  onVariableChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changePageVariable),
        withLatestFrom(this.store.select(selectActivePage)),
        tap(([action, state]) => {
          state?.layout.tiles.forEach((tile) => {
            if (
              !!tile.parameters &&
              !!tile.parameters[`var-${action.name}`] &&
              tile.parameters[`var-${action.name}`] == action?.val
            )
              return;
            if (!tile.meta?.skipUpdateOnVariableChange && !!tile.panelId) {
              this.store.dispatch(
                changePanelParameters({
                  panelId: tile.panelId,
                  parameter: `var-${action.name}`,
                  value: action.val,
                })
              );
              this.store.dispatch(fetchPanelData({ id: tile.panelId }));
            }
          });
        })
      ),
    { dispatch: false }
  );

  onUpdatePanelConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updatePanelConfig),
        withLatestFrom(this.store.select(selectPagesState)),
        tap(([action, state]) => {
          if (!!state.activePanelId && !!action.panel?.panelData) {
            this.store.dispatch(
              setPanelData({
                data: {
                  panelId: state.activePanelId,
                  panelData: action.panel.panelData.newCopy(),
                },
              })
            );
          }
        })
      ),
    { dispatch: false }
  );

  onCopyPanelConfiguration$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(copyPanelConfiguration),
        tap((action) => {
          const config = { ...action.panel };
          if (!!config) {
            delete config.panelData;
            delete config.panelId;
            const stringifiedConfig = JSON.stringify(config);
            localStorage.setItem('copiedPanel', stringifiedConfig);
          }
        })
      ),
    { dispatch: false }
  );

  onSavePageConfiguration$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(savePageConfiguration),
        withLatestFrom(this.store.select(selectActivePage)),
        tap(([action, page]) => {
          let pageConfig = { ...page };
          if (!pageConfig || !pageConfig.layout) return;
          if (!!pageConfig.activeVariables) delete pageConfig.activeVariables;
          pageConfig.parameters = {};
          pageConfig = {
            ...pageConfig,
            layout: {
              ...pageConfig.layout,
              tiles: pageConfig.layout.tiles.map((tile) => {
                const { panelData, parameters, ...rest } = tile;
                return rest;
              }),
            },
          };
          const pageId = pageConfig.scId;
          const stringifiedConfig = JSON.stringify(pageConfig);
          const query = `read(appConfig and dashboard and config->scId == "${pageId}").set("config", ${stringifiedConfig}).recEdit`;
          const zincQuery = queryToZinc(query);

          return this.req.readExprAll(zincQuery).pipe(take(1)).subscribe();
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private req: RequestReadService
  ) {}
}

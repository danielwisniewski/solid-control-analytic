import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { changeActivePageIndex, loadPages } from './pages.actions';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  selectActivePage,
  selectPagesState,
  selectSkysparkFunc,
} from './pages.selectors';
import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';
import { selectPagePath } from '../router/router.reducer';
import { selectActiveSiteId } from '../sites/site.selectors';
import { selectActiveTimerange } from '../timerange/timerange.selectors';
import { RequestReadService } from '../../services/requests/read/request-read.service';
import { queryToZinc } from '../../functions/utils';
import { HGrid } from 'haystack-core';
import {
  fetchPanelData,
  setPanelData,
  changePanelParameters,
  changeActivePanelIndex,
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
          this.store.select(selectActivePage)
        ),
        distinctUntilChanged(),
        tap(([pages, route]) => {
          this.store.dispatch(setActiveTimerange({ dates: '' }));

          const activePageIndex = pages.pages.findIndex(
            (page) => page.path === route
          );
          this.store.dispatch(
            changeActivePageIndex({ index: activePageIndex })
          );
        })
      ),
    { dispatch: false }
  );

  onFetchPanelData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchPanelData),
        withLatestFrom(
          this.store.select(selectActiveSiteId),
          this.store.select(selectSkysparkFunc),
          this.store.select(selectActiveTimerange),
          this.store.select(selectActivePage),
          this.store.select(selectPagesState)
        ),
        tap(([action, activeSite, skysparkFunc, timerange, page, state]) => {
          this.store.dispatch(
            setPanelData({
              data: {
                pageIndex: state.activePageIndex,
                panelId: action.id,
                panelData: undefined,
              },
            })
          );
        }),
        filter(
          ([action, activeSite, skysparkFunc, timerange, page, state]) =>
            !!activeSite && !!skysparkFunc && !!timerange && action.id > -1
        ),
        map(([action, activeSite, skysparkFunc, timerange, page, state]) => {
          let parameters =
            page?.layout.tiles.find((tile) => tile.tile === action.id)
              ?.parameters ?? {};

          if (!!state.detailsPageId)
            parameters = { ...parameters, detailsPageId: state.detailsPageId };

          const jsonParameters =
            Object.keys(parameters).length > 0
              ? `, ${JSON.stringify(parameters)}`
              : '';
          return {
            query: `${skysparkFunc}(${action.id},${timerange},${activeSite}${jsonParameters})`,
            panelId: action.id,
          };
        }),
        distinctUntilChanged(),
        mergeMap((query) => {
          return this.req.readExprAll(queryToZinc(query.query)).pipe(
            withLatestFrom(this.store.select(selectPagesState)),
            tap(([res, state]) => {
              this.store.dispatch(
                setPanelData({
                  data: {
                    pageIndex: state.activePageIndex,
                    panelId: query.panelId,
                    panelData: HGrid.make(res),
                  },
                })
              );
            })
          );
        })
      ),
    { dispatch: false }
  );

  onPageChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeActivePageIndex),
        withLatestFrom(this.store.select(selectActivePage)),
        filter(([action, page]) => !!page && !!action),
        map(([action, page]) => page!),
        distinctUntilChanged(),
        map((page: PageState) => {
          const hasQueryVariable = page.variables?.some(
            (variable) => variable.type === 'query'
          );
          page.layout.tiles.forEach((tile) => {
            if (!!tile.hasRollupSelector) return;
            if (!!hasQueryVariable && !tile.meta?.skipUpdateOnVariableChange)
              return;
            this.store.dispatch(fetchPanelData({ id: tile.tile }));
          });
        })
      ),
    { dispatch: false }
  );

  onParameterChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changePanelParameters),
        withLatestFrom(this.store.select(selectPagesState)),
        tap(([res, state]) =>
          this.store.dispatch(fetchPanelData({ id: state.activePanelId }))
        ),
        tap(([res, state]) => {
          this.store.dispatch(changeActivePanelIndex({ id: -1 }));
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

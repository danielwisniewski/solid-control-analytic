import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import {
  changeActivePageIndex,
  fetchPanelData,
  fetchPanelsData,
  loadPages,
  setPanelData,
} from './pages.actions';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
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
        map(([pages, route]) => {
          const activePageIndex = pages.pages.findIndex(
            (page) => page.path === route
          );
          this.store.dispatch(
            changeActivePageIndex({ index: activePageIndex })
          );
          return pages.pages[activePageIndex].layout;
        }),
        tap((res) => {
          if (!res) return;
          res.tiles.forEach((tile) => {
            if (!tile.hasRollupSelector) {
              this.store.dispatch(fetchPanelData({ id: tile.tile }));
            }
          });
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
        ofType(fetchPanelsData),
        withLatestFrom(this.store.select(selectActivePage)),
        filter(([action, page]) => !!page),
        map(([action, page]) => page!),
        tap((page: PageState) => {
          page.layout.tiles.forEach((tile) => {
            this.store.dispatch(fetchPanelData({ id: tile.tile }));
          });
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

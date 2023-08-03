import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, tap, withLatestFrom } from 'rxjs';
import {
  selectDetailsPageId,
  selectPagePath,
  selectPageUrl,
} from './router.reducer';
import { AppState } from 'src/app/state';
import {
  changeActivePageId,
  changeCreatorModeState,
  changeDetailsPageState,
} from '../pages/pages.actions';
import { selectPages } from '../pages/pages.selectors';

@Injectable()
export class RouterEffects {
  onPageChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        withLatestFrom(
          this.store.select(selectPageUrl),
          this.store.select(selectDetailsPageId),
          this.store.select(selectPages),
          this.store.select(selectPagePath)
        ),
        tap(([router, url, detailsPage, pages, pagePath]) => {
          const isCreator = url.includes('/creator');
          this.store.dispatch(changeCreatorModeState({ status: isCreator }));
          this.store.dispatch(changeDetailsPageState({ id: detailsPage }));
        }),
        filter(([router, url, detailsPage, pages, pagePath]) => !!pages),
        tap(([router, url, detailsPage, pages, pagePath]) => {
          if (url.includes('/dashboard/')) {
            const pageToFind = !!detailsPage ? `${pagePath}/details` : pagePath;
            const activePage = pages?.find((page) => page.path === pageToFind);
            if (!!activePage) {
              this.store.dispatch(
                changeActivePageId({ index: activePage.scId })
              );
            }
          }
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}

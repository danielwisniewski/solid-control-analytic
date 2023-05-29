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
  changeActivePageIndex,
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
        filter(([router, url, detailsPage, pages, pagePath]) => !!pages),
        tap(([router, url, detailsPage, pages, pagePath]) => {
          const isCreator = url.includes('/creator');

          this.store.dispatch(changeCreatorModeState({ status: isCreator }));
          this.store.dispatch(changeDetailsPageState({ id: detailsPage }));

          if (url.includes('/dashboard/')) {
            const activePageIndex =
              pages?.findIndex((page) => page.path === pagePath) ?? -1;
            if (activePageIndex > -1)
              this.store.dispatch(
                changeActivePageIndex({ index: activePageIndex })
              );
          }
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}

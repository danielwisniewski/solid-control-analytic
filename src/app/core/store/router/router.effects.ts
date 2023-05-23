import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';
import { selectDetailsPageId, selectPageUrl } from './router.reducer';
import { AppState } from 'src/app/state';
import {
  changeCreatorModeState,
  changeDetailsPageState,
  fetchPanelsData,
} from '../pages/pages.actions';

@Injectable()
export class RouterEffects {
  onPageChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        withLatestFrom(
          this.store.select(selectPageUrl),
          this.store.select(selectDetailsPageId)
        ),
        tap(([router, url, detailsPage]) => {
          const isCreator = url.includes('/creator');
          this.store.dispatch(changeCreatorModeState({ status: isCreator }));

          this.store.dispatch(changeDetailsPageState({ id: detailsPage }));

          this.store.dispatch(fetchPanelsData());
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}

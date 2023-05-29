import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  distinctUntilChanged,
  filter,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { setActiveTimerange } from './timerange.actions';
import { Store } from '@ngrx/store';
import { selectPagesState } from '../pages/pages.selectors';
import { fetchPanelData } from '../pages/panels.actions';

@Injectable()
export class TimerangeEffects {
  saveActiveTimerange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setActiveTimerange),
        filter((data) => data.dates !== ''),
        distinctUntilChanged(),
        tap((action) => {
          const localStorageKey = 'activeTimerange';
          localStorage.setItem(localStorageKey, action.dates);
        }),
        withLatestFrom(this.store.select(selectPagesState)),
        tap(([action, page]) => {
          if (!!page && !!page.pagesConfig)
            page?.pagesConfig[page.activePageIndex].layout.tiles.forEach(
              (tile) => {
                if (!!tile.meta?.skipUpdateOnTimerangeChange) return;
                this.store.dispatch(fetchPanelData({ id: tile.tile }));
              }
            );
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store) {}
}

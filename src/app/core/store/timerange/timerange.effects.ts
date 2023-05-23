import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { setActiveTimerange } from './timerange.actions';
import { DateTime } from 'luxon';
import { Store } from '@ngrx/store';
import { fetchPanelsData } from '../pages/pages.actions';

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

          this.store.dispatch(fetchPanelsData());
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store) {}
}

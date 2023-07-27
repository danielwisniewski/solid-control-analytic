import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { changeActiveSite, updateSites } from './site.actions';
import { tap, withLatestFrom } from 'rxjs';
import { selectPagesState } from '../pages/pages.selectors';
import { fetchPanelData } from '../pages/panels.actions';

@Injectable()
export class SitesEffects {
  onSiteChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(changeActiveSite, updateSites),
        withLatestFrom(this.store.select(selectPagesState)),
        tap(([action, state]) => {
          if (action.type === '[Site] Change Active Site') {
            localStorage.setItem('site', JSON.stringify(action.site.toJSON()));
          }

          if (!!state && !!state.pagesConfig)
            state?.pagesConfig.forEach((page) => {
              if (page.scId === state.activePageId) {
                page.layout.tiles.forEach((tile) => {
                  if (
                    (!!tile.meta?.skipUpdateOnSiteChange &&
                      action.type === '[Site] Change Active Site') ||
                    !tile.panelId
                  )
                    return;
                  this.store.dispatch(fetchPanelData({ id: tile.panelId }));
                });
              }
            });
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}

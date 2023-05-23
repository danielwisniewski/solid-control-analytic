import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { HDict } from 'haystack-core';
import { filter, map, Observable } from 'rxjs';
import { SiteStore } from 'src/app/core/store/site.store';
import { AppState } from 'src/app/state';
import {
  selectActiveSite,
  selectSites,
} from '../../store/sites/site.selectors';
import { changeActiveSite } from '../../store/sites/site.actions';

@Component({
  selector: 'app-site-dropdown-button',
  templateUrl: './site-dropdown-button.component.html',
  styleUrls: ['./site-dropdown-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteDropdownButtonComponent {
  constructor(private sitesStore: SiteStore, private store: Store<AppState>) {}

  @Input() showPortfolioOption: boolean = false;

  title: string = 'Wybierz budynek';
  sitesList$: Observable<HDict[] | undefined> = this.store
    .select(selectSites)
    .pipe(
      filter((sites) => !!sites),
      map((sites) => {
        return sites?.getRows();
      })
    );

  activeSite$: Observable<string | undefined> = this.store
    .select(selectActiveSite)
    .pipe(
      filter((site) => !!site && !!site.toDis()),
      map((site) => site?.toDis() ?? undefined)
    );

  changeActiveSite(site: HDict): void {
    if (!!site) {
      this.sitesStore.changeActiveSite(site);
      this.store.dispatch(changeActiveSite({ site: site }));
    }
  }
}

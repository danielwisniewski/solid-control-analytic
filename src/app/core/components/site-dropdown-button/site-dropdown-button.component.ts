import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { HDict } from 'haystack-core';
import { filter, map, Observable } from 'rxjs';
import { SiteStore } from 'src/app/core/store/site.store';

@Component({
  selector: 'app-site-dropdown-button',
  templateUrl: './site-dropdown-button.component.html',
  styleUrls: ['./site-dropdown-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteDropdownButtonComponent {
  constructor(private sitesStore: SiteStore) {}

  @Input() showPortfolioOption: boolean = false;

  title: string = 'Wybierz budynek';
  sitesList$: Observable<HDict[] | undefined> = this.sitesStore.sites$.pipe(
    filter((sites) => !!sites),
    map((sites) => {
      return sites?.getRows();
    })
  );

  activeSite$: Observable<string | undefined> =
    this.sitesStore.activeSite$.pipe(
      filter((site) => !!site && !!site.toDis()),
      map((site) => site?.toDis() ?? undefined)
    );

  changeActiveSite(site: HDict): void {
    if (!!site) this.sitesStore.changeActiveSite(site);
  }
}

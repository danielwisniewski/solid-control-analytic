import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { HDict, HGrid, HList } from 'haystack-core';
import { map, Observable } from 'rxjs';
import { SiteStoreService } from 'src/app/core/store/site-store.service';

@Component({
  selector: 'app-site-dropdown-button',
  templateUrl: './site-dropdown-button.component.html',
  styleUrls: ['./site-dropdown-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteDropdownButtonComponent implements OnInit {
  constructor(private sitesStore: SiteStoreService) {}
  @Input() showPortfolioOption: boolean = false;
  title: string = 'Wybierz budynek';
  sitesList$: Observable<HDict[]> = this.sitesStore.sitesData$.pipe(
    map((sites) => {
      return sites.getRows();
    })
  );
  activeSite$: Observable<string | undefined> =
    this.sitesStore.activeSite$.pipe(map((site) => site?.toDis()));

  ngOnInit(): void {}

  changeActiveSite(site: HDict): void {
    this.sitesStore.activeSite$.next(site);
  }
}

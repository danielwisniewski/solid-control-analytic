import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { SiteStoreService } from 'src/app/core/store/site-store.service';

@Component({
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnDestroy {
  constructor(
    private siteStore: SiteStoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  private sub: Subscription = this.siteStore.activeSite$.subscribe((site) => {
    if (!site) this.siteFound = false;
    const SITE_ID = site?.toDis();
    if (SITE_ID === 'Portfolio')
      this.router.navigate([`./portfolio`], { relativeTo: this.route });
    else this.router.navigate([`./site`], { relativeTo: this.route });
  });

  siteFound: boolean = true;

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, merge, tap } from 'rxjs';
import { Tile } from '../interfaces/dashboard.interface';
import { DashboardStore } from '../store/dashboard.store';
import { ActivatedRoute } from '@angular/router';
import { PageStoreService } from '../store/page.store.service';

@Component({
  selector: 'app-ventilation',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageStoreService],
})
export class DashboardComponent {
  constructor(
    private route: ActivatedRoute,
    private pageStore: PageStoreService,
    private dashboardStore: DashboardStore
  ) {}

  isCreatorMode: boolean = this.route.snapshot.url
    .toString()
    .includes('creator');

  pageConfig$ = merge(
    this.pageStore.activePage$,
    this.dashboardStore.activePage$,
    this.dashboardStore.activePageByCreatorModule$
  ).pipe(filter((res) => !!res));

  trackBy(index: number, item: Tile) {
    return item.tile;
  }
}

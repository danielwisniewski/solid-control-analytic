import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { PageConfig, Tile } from '../interfaces/dashboard.interface';
import { DashboardStore } from '../store/dashboard.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ventilation',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnDestroy {
  constructor(
    private DashboardStore: DashboardStore,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.sub = this.route.params.subscribe((route) => {
      this.DashboardStore.routerParam$.next(route['type']);
      this.DashboardStore.detailsPageId$.next(route['id']);
      this.isCreatorMode = this.route.snapshot.url
        .toString()
        .includes('creator');
    });
  }
  private sub: Subscription;

  isCreatorMode: boolean = false;

  pageConfig$: Observable<PageConfig | undefined> =
    this.DashboardStore.dashboardConfig$;

  trackBy(index: number, item: Tile) {
    return item.tile;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { DashboardState, Tile } from '../interfaces/dashboard.interface';
import { DashboardStore } from '../store/dashboard.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ventilation',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnDestroy {
  constructor(
    private DashboardStore: DashboardStore,
    private route: ActivatedRoute
  ) {
    this.sub = this.route.params.subscribe((route) =>
      this.DashboardStore.routerParam$.next(route['type'])
    );
  }

  private sub: Subscription;

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  dashboardState$: Observable<DashboardState> =
    this.DashboardStore.dashboardState$;

  trackBy(index: number, item: Tile) {
    return item.tile;
  }
}

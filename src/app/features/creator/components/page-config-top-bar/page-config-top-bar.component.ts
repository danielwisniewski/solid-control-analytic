import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { DashboardStore } from '../../../dashboard/store/dashboard.store';
import { Subscription, filter, merge } from 'rxjs';
import { PageState } from '../../../dashboard/interfaces/page-config.interface';

import { defaultRollups } from '../../../dashboard/constants/dashboard.constants';
import { CreatePageService } from '../../services/create-page.service';
import { Panel } from 'src/app/features/dashboard/interfaces/panel.interface';
@Component({
  selector: 'app-page-config-top-bar',
  templateUrl: './page-config-top-bar.component.html',
  styleUrls: ['./page-config-top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageConfigTopBarComponent implements OnInit, OnDestroy {
  constructor(
    private dashboardStore: DashboardStore,
    private cdr: ChangeDetectorRef,
    private createPageService: CreatePageService
  ) {}

  sub: Subscription | undefined;

  ngOnInit(): void {
    this.sub = merge(
      this.dashboardStore.activePage$,
      this.dashboardStore.activePageByCreatorModule$
    )
      .pipe(filter((res) => !!res))
      .subscribe((res) => {
        this.pageConfig = res;
        this.cdr.detectChanges();
      });
  }

  pageConfig: PageState | undefined;

  change() {
    this.dashboardStore.activePageByCreatorModule$.next(this.pageConfig);
  }

  onSave() {
    if (!!this.pageConfig)
      this.createPageService.updateConfiguration(this.pageConfig);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onAddPanel() {
    if (!this.pageConfig) return;
    const lastPanelId: number = Math.max(
      ...this.pageConfig.layout.tiles.map((r) => r.tile)
    );
    const newPanel: Panel = {
      tile: lastPanelId + 1,
      cols: 6,
      rows: 3,
      type: 'chart',
      hasRollupSelector: false,
      rollups: defaultRollups,
      meta: {
        title: '',
        showTitle: false,
        subtitle: '',
        showSubtitle: false,
        showTileTypeSelector: true,
        hasDownloadButton: false,
        noDataTitle: 'Nie znaleziono danych',
        noDataSubtitle: 'Spróbuj wybrać inne urządzenie lub czasookres',
        chartType: 'bar',
        showLegend: true,
        legendPosition: 'bottom',
        filterColumns: false,
        treeFromRelation: 'submeterOf.val',
        treeToRelation: 'id.val',
        pivotAllowed: true,
        stacked: false,
      },
      columnsMeta: [],
    };
    this.pageConfig.layout.tiles.push(newPanel);
    this.change();
  }

  generateSkysparkFunction() {
    if (!this.pageConfig || !this.pageConfig.skysparkFunc) return;
    this.createPageService.generateSkysparkFunction(this.pageConfig);
  }
}

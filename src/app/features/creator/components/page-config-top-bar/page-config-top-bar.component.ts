import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription, merge } from 'rxjs';
import { PageState } from '../../../dashboard/interfaces/page-config.interface';

import { defaultRollups } from '../../../dashboard/constants/dashboard.constants';
import { CreatePageService } from '../../services/create-page.service';
import { Panel } from 'src/app/features/dashboard/interfaces/panel.interface';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import { selectActivePage } from 'src/app/core/store/pages/pages.selectors';
import { updatePageConfig } from 'src/app/core/store/pages/pages.actions';
import { addNewPanel } from 'src/app/core/store/pages/panels.actions';
@Component({
  selector: 'app-page-config-top-bar',
  templateUrl: './page-config-top-bar.component.html',
  styleUrls: ['./page-config-top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageConfigTopBarComponent implements OnInit, OnDestroy {
  constructor(
    private cdr: ChangeDetectorRef,
    private createPageService: CreatePageService,
    private store: Store<AppState>
  ) {}
  allRanges: string[] = [
    'Zeszły tydzień',
    'Obecny tydzień',
    'Ostatnie 2 dni',
    'Ostatnie 7 dni',
    'Zeszły miesiąc',
    'Obecny miesiąc',
    'Ostatnie 30 dni',
    'Ostatnie 90 dni',
    'Zeszły kwartał',
    'Obecny kwartał',
    'Ostatnie 6 miesięcy',
    'Zeszły rok',
    'Obecny rok',
    'Ostatnie 2 lata',
  ];

  ranges: string[] = [
    'Zeszły tydzień',
    'Obecny tydzień',
    'Zeszły miesiąc',
    'Obecny miesiąc',
    'Ostatnie 30 dni',
    'Zeszły rok',
    'Obecny rok',
  ];

  sub: Subscription | undefined;

  ngOnInit(): void {
    this.sub = merge(this.store.select(selectActivePage)).subscribe((res) => {
      if (!!res) this.pageConfig = { ...res };
      if (!!res?.layout) this.layout = { ...res.layout };
      if (!!res?.datepicker?.parameters.displayedRanges)
        this.ranges = [...res.datepicker.parameters.displayedRanges];
      this.cdr.detectChanges();
    });
  }

  pageConfig: PageState | undefined;

  layout: any;

  change() {
    if (!!this.pageConfig) {
      this.store.dispatch(updatePageConfig({ config: this.pageConfig }));
    }
  }

  changeRanges(range: string) {
    const index = this.isInRanges(range);

    if (index === -1) this.ranges.push(range);
    else {
      delete this.ranges[index];
      this.ranges = this.ranges.filter((v) => v);
    }

    if (
      !!this.pageConfig &&
      !!this.pageConfig.datepicker &&
      typeof this.pageConfig.datepicker == 'object'
    ) {
      this.pageConfig = {
        ...this.pageConfig,
        datepicker: {
          ...this.pageConfig.datepicker,
          parameters: {
            ...this.pageConfig.datepicker.parameters,
            displayedRanges: this.ranges,
          },
        },
      };
      this.change();
    }
  }

  isInRanges(range: string) {
    return this.ranges.findIndex((r) => r === range);
  }

  changeTimepickerType(type: any) {
    const TYPE = type.value;

    if (
      !!this.pageConfig &&
      !!this.pageConfig.datepicker &&
      typeof this.pageConfig.datepicker == 'object'
    ) {
      this.pageConfig = {
        ...this.pageConfig,
        datepicker: {
          ...this.pageConfig.datepicker,
          type: TYPE,
        },
      };
    } else if (!!this.pageConfig) {
      this.pageConfig = {
        ...this.pageConfig,
        datepicker: {
          type: type.value,
          parameters: {},
        },
      };
    }
    this.change();
  }

  changeMaxDateRange(range: any) {
    const value = parseInt(range.value);
    if (!!this.pageConfig?.datepicker) {
      this.pageConfig = {
        ...this.pageConfig,
        datepicker: {
          ...this.pageConfig?.datepicker,
          parameters: {
            ...this.pageConfig?.datepicker?.parameters,
            maxDateRange: value,
          },
        },
      };
      this.change();
    }
  }

  changeTimepickerParameter(type: any) {
    const TYPE = type.value;

    if (
      !!this.pageConfig &&
      !!this.pageConfig.datepicker &&
      typeof this.pageConfig.datepicker == 'object'
    ) {
      this.pageConfig = {
        ...this.pageConfig,
        datepicker: {
          ...this.pageConfig.datepicker,
          parameters: {
            ...this.pageConfig.datepicker.parameters,
            minMode: TYPE,
            startView: TYPE,
          },
        },
      };
    } else if (!!this.pageConfig) {
      this.pageConfig = {
        ...this.pageConfig,
        datepicker: {
          type: 'range',
          parameters: {
            minMode: TYPE,
            startView: TYPE,
          },
        },
      };
    }
    this.change();
  }

  changeLayout() {
    if (!!this.pageConfig && !!this.layout) {
      this.store.dispatch(
        updatePageConfig({
          config: { ...this.pageConfig, layout: { ...this.layout } },
        })
      );
    }
  }

  changeDefaultRange(value: string | undefined) {
    if (!!this.pageConfig?.datepicker) {
      this.pageConfig = {
        ...this.pageConfig,
        datepicker: {
          ...this.pageConfig?.datepicker,
          defaultRange: value,
        },
      };
      this.change();
    }
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
      panelId: Math.random().toString(36).slice(2),
      cols: 6,
      rows: 4,
      type: 'chart',
      hasRollupSelector: false,
      rollups: defaultRollups,
      meta: {
        showTitle: false,
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
    this.store.dispatch(addNewPanel({ panel: newPanel }));
  }

  generateSkysparkFunction() {
    if (!this.pageConfig || !this.pageConfig.skysparkFunc) return;
    this.createPageService.generateSkysparkFunction(this.pageConfig);
  }
}

import { Injectable } from '@angular/core';

import { DashboardStore } from './dashboard.store';
import { SiteStore } from 'src/app/core/store/site.store';
import { TimerangeStore } from 'src/app/core/store/timerange.store';
import {
  BehaviorSubject,
  Observable,
  auditTime,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  shareReplay,
  skip,
  switchMap,
  tap,
} from 'rxjs';
import { PageConfig, Tile } from '../interfaces/dashboard.interface';
import { DashboardService } from '../services/dashboard.service';
import { HGrid } from 'haystack-core';

@Injectable()
export class PanelStoreService {
  constructor(
    private dashboardStore: DashboardStore,
    private siteStore: SiteStore,
    private timerangeStore: TimerangeStore,
    private dashboardService: DashboardService
  ) {}

  setTileNumber(id: number) {
    this.tileId = id;
  }

  private tileId: number | undefined;
  private panelConfig: Tile | undefined;
  private pageConfig: PageConfig | undefined;

  rollupParameter$ = new BehaviorSubject<any>({});
  private rollupParameter: any = {};
  private pageVariables: any = {};

  private onPageConfigChange$ = merge(
    this.dashboardStore.activePage$,
    this.dashboardStore.activePageByCreatorModule$
  ).pipe(
    filter((res) => !!this.tileId && !!res),
    shareReplay(1)
  );

  /**
   * ! ON SITE CHANGE BY USER USING DROPDOWN BUTTON ON THE TOP BAR
   * ? On changing active site/building is required to fetch from backed data related to each panel.
   *
   * ? When page has variable button with values fetched from backend then change will
   * ? be triggered by the DashboardVariableComponent not by active site change.
   *
   * ? Skip emitted value on init.
   */
  private onSiteChange$ = this.siteStore.activeSite$.pipe(
    skip(1),
    filter(
      () =>
        !this.pageConfig?.variables?.some(
          (variable) => variable.type === 'query'
        )
    )
  );

  /**
   * ! ON TIMERANGE CHANGE BY USER USING DROPDOWN BUTTON ON THE TOP BAR
   * ? On changing active timerange it is required to fetch from backend updated data related to each panel.
   *
   * ? Skip emitted value on init.
   */
  private onTimerangeChange$ = this.timerangeStore.activeTimerange$.pipe(
    skip(1)
  );

  /**
   * ! ON ACTIVE PAGE/DASHBOARD CHANGE BY ROUTER/USER
   * ? When redirects to the new page then it is needed to fetch from backend
   * ? page configuration and data related to each panel.
   * ? PageConfig returns configuration of the entire page. Based on TileId only active panel is selected.
   */
  onPageChange$: Observable<Tile | undefined> = this.onPageConfigChange$.pipe(
    filter(() => !!this.tileId),
    tap((pageConfig: PageConfig | undefined) => (this.pageConfig = pageConfig)),
    map((pageConfig: PageConfig | undefined) =>
      pageConfig?.layout.tiles.find((tile) => tile.tile === this.tileId)
    ),
    filter((res) => !!res),
    tap((config) => {
      this.panelConfig = config;
    }),
    filter((res) => !!res)
  );

  /**
   * ! ON ROLLUP SELECTOR CHANGE MADE BY USER
   * ? Related to panels that have rollup selector
   * ? When rollup value is changed by user then new data from backend has to be fetched.
   */
  onPanelRollupChange$ = this.rollupParameter$.pipe(
    /**
     * ? Skip checking rollup parameters on initialization
     */
    // distinctUntilChanged(
    //   (prev, curr) => prev.rollup.value === curr.rollup.value
    // ),
    tap((res) => (this.rollupParameter = res)),
    filter((res) => !!Object.keys(res).length),
    distinctUntilChanged()
  );

  /**
   * ! ON PAGE VARIABLE CHANGE BY USER USING DROPDOWN BUTTON ON THE TOP BAR
   * ? On page variable change all panels data should be updated by fetching from backend
   * TODO Add possibility to choose what panel should be updated by Page variable.
   */
  onPageVariableChange$ = this.dashboardStore.pageVariables$.pipe(
    filter((res) => !!res),
    tap((res) => {
      this.pageVariables = undefined;
      if (!!res) {
        this.pageVariables = {
          ...res,
        };
      }
    }),
    distinctUntilChanged()
  );

  /**
   *
   */
  private updatePanelDataByUser$ = merge(
    this.onPageConfigChange$,
    this.onPanelRollupChange$,
    this.onSiteChange$,
    this.onPageVariableChange$,
    this.onTimerangeChange$,
    this.dashboardStore.triggerDataUpdate$
  ).pipe(
    filter(
      () => !!this.pageConfig?.layout.tiles.some((r) => r.tile === this.tileId)
    ),
    /**
     * ? Sending undefined first is used to show loading spinner on the panel. To let know user that data is updating.
     */
    auditTime(100),
    map(() => {
      const params = {
        ...this.rollupParameter,
        ...this.pageVariables,
      };
      return this.dashboardService.generateQuery(this.tileId!, {
        ...params,
      });
    }),
    filter((res) => {
      if (!!this.panelConfig?.hasRollupSelector && !res.includes('"rollup"'))
        return false;
      else return true;
    }),
    filter((res) => {
      if (!!this.pageConfig?.variables?.length) {
        return this.pageConfig.variables.every((r) =>
          res.includes(`var-${r.name}`)
        );
      } else return true;
    }),
    distinctUntilChanged()
  );

  sendRequest$ = merge(
    this.updatePanelDataByUser$,
    this.dashboardStore.triggerDataUpdate$
  ).pipe(
    filter((res) => !!res),
    tap((res) => console.log(res)),
    switchMap(() => {
      const params = {
        ...this.rollupParameter,
        ...this.pageVariables,
      };
      return merge(
        of(undefined),
        this.dashboardService.getData(this.tileId!, {
          ...params,
        })
      );
    }),
    map((res) => {
      if (!!res && !!this.panelConfig?.meta) {
        const meta = this.panelConfig?.meta as any;
        res.meta.update(meta);
      }
      if (!!res && !!this.panelConfig?.columnsMeta?.length) {
        this.panelConfig.columnsMeta?.forEach((columnMeta) => {
          for (const meta in columnMeta) {
            res
              ?.getColumn(columnMeta.columnName)
              ?.meta.set(meta, columnMeta[meta]);
          }
        });
      }

      this.panelData = res;
      return res?.newCopy();
    }),
    shareReplay(1)
  );

  private panelData: HGrid | undefined;

  updateTileDataByCreator$ =
    this.dashboardStore.activePageByCreatorModule$.pipe(
      filter(() => this.dashboardStore.activeTile$.getValue() === this.tileId),
      map((pageConfig: PageConfig | undefined) =>
        pageConfig?.layout.tiles.find((tile) => tile.tile === this.tileId)
      ),
      map((panelConfig) => {
        this.panelConfig = panelConfig;
        if (!!this.panelData && !!this.panelConfig?.meta) {
          const meta = this.panelConfig?.meta as any;
          this.panelData?.meta.update(meta);
        }
        if (!!this.panelData && !!this.panelConfig?.columnsMeta?.length) {
          this.panelConfig.columnsMeta.forEach((columnMeta) => {
            for (const meta in columnMeta) {
              this.panelData
                ?.getColumn(columnMeta.columnName)
                ?.meta.set(meta, columnMeta[meta]);
            }
          });
        }
        return this.panelData?.newCopy();
      }),
      filter((res) => !!res),
      shareReplay(1)
    );

  tileData$ = merge(this.sendRequest$, this.updateTileDataByCreator$);

  updateParameters(parameters: any) {
    this.rollupParameter = parameters;
    this.rollupParameter$.next(parameters);
  }
}

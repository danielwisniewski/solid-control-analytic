import { Injectable } from '@angular/core';
import { HDict, HMarker, HStr } from 'haystack-core';
import { finalize, take } from 'rxjs';
import {
  ChildrenItems,
  RouteInfo,
} from 'src/app/core/components/sidebar/sidebar.component';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { AppStore } from 'src/app/core/store/app.store.';
import { defaultRollups } from '../../dashboard/constants/dashboard.constants';
import { PageState } from '../../dashboard/interfaces/page-config.interface';
import { queryToZinc } from 'src/app/core/functions/utils';

@Injectable({
  providedIn: 'root',
})
export class CreatePageService {
  constructor(
    private readReq: RequestReadService,
    private appStore: AppStore
  ) {}

  addNewPage(page: RouteInfo | ChildrenItems) {
    const newPage: PageState = {
      scId: Math.random().toString(36).slice(2),
      path: page.path.replace('/dashboard/', ''),
      title: page.title,
      showSiteSelector: true,
      showTimerangeSelector: true,
      skysparkFunc: '',
      layout: {
        colNumber: 12,
        rowHeight: 10,
        tiles: [
          {
            tile: 1,
            cols: 5,
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
              chartType: 'donut',
              showLegend: true,
              legendPosition: 'right',
              filterColumns: false,
              treeFromRelation: 'submeterOf.val',
              treeToRelation: 'id.val',
              pivotAllowed: true,
              stacked: false,
            },
            columnsMeta: [],
          },
          {
            tile: 2,
            cols: 7,
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
              stacked: true,
            },
            columnsMeta: [],
          },
          {
            tile: 3,
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
          },
          {
            tile: 4,
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
              hasDownloadButton: false,
              showTileTypeSelector: true,
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
          },
        ],
      },
      datepicker: {
        type: 'range',
        parameters: {},
      },
      variables: [],
    };

    const data = HDict.make({
      dis: HStr.make(page.title),
      appConfig: HMarker.make(),
      dashboard: HMarker.make(),
      config: HDict.make(newPage as any),
    }).toAxon();

    const query = `(${data}).recNew`;
    const zincQuery = HStr.make(query).toZinc();
    return this.readReq.readExprAll(zincQuery).pipe(take(1)).subscribe();
  }

  updateConfiguration(config: PageState) {
    const query = `read(appConfig and dashboard and config->scId == "${
      config.scId
    }").set("config", ${JSON.stringify(config)}).recEdit`;

    const zincQuery = queryToZinc(query);

    return this.readReq.readExprAll(zincQuery).pipe(take(1)).subscribe();
  }

  generateSkysparkFunction(pageConfig: PageState) {
    const src = `(tile, date, site, parameters: {}) => do

    data: readAll(energy and equipRef->elec and siteRef->id == site->id)
      .hisRead(date)
      .hisClip

    rollup: if (parameters.has("rollup")) parameters.get("rollup").get("value") else "1day";
    rollup = rollup.parseNumber;

    if (tile == 1) do
      return data.hisRollup(sum, "*").hisMap(v => v).removeCol("ts")
    end

    if (tile == 2) do
      return data.hisRollup(sum, rollup).hisInterpolate
    end

    if (tile == 3) do
      return [].toGrid()
    end

    if (tile == 4) do
      return [].toGrid()
    end

    else return [].toGrid()

end`;
    const dict = HDict.make({
      func: HMarker.make(),
      solidControlFunc: HMarker.make(),
      dashboard: HMarker.make(),
      dis: HStr.make(pageConfig.title),
      name: HStr.make(pageConfig.skysparkFunc),
      src: HStr.make(src),
    });

    const query = `(${dict.toAxon()}).recNew`;
    const zincQuery = queryToZinc(query);
    return this.readReq.readExprAll(zincQuery).pipe(take(1)).subscribe();
  }
}

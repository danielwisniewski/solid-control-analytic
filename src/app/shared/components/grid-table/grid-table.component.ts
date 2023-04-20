import {
  Component,
  Input,
  OnInit,
  SimpleChange,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HGrid, grid } from 'haystack-core';
import { DateTime } from 'luxon';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';
import { formatHaystackValue } from 'src/app/features/tmmp-config/utils/utils.functions';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
})
export class GridTableComponent implements OnInit {
  @Input() data: HGrid | undefined = undefined;
  @Input() rollup: string = '1day';
  @Input() timerange: string[] = [
    DateTime.local()
      .minus({ days: 7 })
      .startOf('day')
      .toFormat('yyyy-MM-dd')
      .toString(),
    DateTime.local().toFormat('yyyy-MM-dd').toString(),
  ];
  @ViewChild('display') display: TemplateRef<any> | undefined;

  constructor(
    private route: ActivatedRoute,
    private siteStore: SiteStoreService,
    private req: RequestReadService
  ) {}

  columns: TableColumn[] = [];
  rows: any[] = [];
  title: string = this.data?.meta.get('title')?.toString() ?? 'Raport';
  dashboard: string = this.route.snapshot.url[0]?.path;

  messages = {
    emptyMessage: `
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Nie znaleziono danych</h2>
          <p class="text-center">Spróbuj wybrać inne urządzenie lub zmień czasookres</p>
        </div>
      </div>
    `,
  };

  ngOnChanges(simpleChange: SimpleChange) {
    this.generateConfig();
    this.title = this.data?.meta.get('title')?.toString() ?? 'Raport';
  }

  generateConfig(): void {
    if (!this.data) return;
    if (!this.display) return;
    this.columns = [];
    this.rows = [];
    for (let i = 0; i < this.data.getColumnsLength(); i++) {
      const regExpr: RegExp = new RegExp('^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$');
      const name = this.data.getColumn(i)?.dis ?? 'test';
      const column: TableColumn = {
        name: this.data.getColumn(i)?.dis,
        prop: this.data.getColumn(i)?.name,
        sortable: false,
        resizeable: true,
        draggable: false,
        headerClass: 'text-center',
        cellClass: 'text-center',
        cellTemplate: this.display,
        maxWidth: regExpr.test(name) ? 150 : 700,
      };
      this.columns.push(column);
    }
    if (typeof this.data.toJSON().rows !== 'undefined') {
      this.rows = this.data.toJSON()!.rows!;
    }
    if (this.columns[0].name === 'empty') this.columns[0].name = '';
  }

  formatValue(value: any) {
    return formatHaystackValue(value);
  }

  download() {
    if (window.location.href.includes('charts')) {
      const query = `${this.dashboard}ReportChart(4, toDateSpan(${
        this.timerange[0]
      }..${this.timerange[1]}),${this.siteStore.activeSite$
        .getValue()
        ?.get('id')
        ?.toZinc(true)})`;

      const VIEW_NAME = 'tableReport';

      const STATE = `{ funcData: "${query}" }`;

      this.req.generateExportRequest(VIEW_NAME, STATE, this.title);
    } else if (window.location.href.includes('reports')) {
      const query = `${this.dashboard}(toDateSpan(${this.timerange[0]}..${this.timerange[1]}), ${this.rollup})`;

      const VIEW_NAME = 'costCenter';

      const STATE = `{ funcData: "${query}" }`;

      this.req.generateExportRequest(
        VIEW_NAME,
        STATE,
        `Centra kosztowe ${this.timerange[0]} - ${this.timerange[1]}`
      );
    }
  }

  ngOnInit(): void {}
}

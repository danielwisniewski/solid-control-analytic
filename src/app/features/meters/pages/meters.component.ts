import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { SelectionType, TableColumn } from '@swimlane/ngx-datatable';
import { HDict, HGrid, HList, HStr } from 'haystack-core';
import { map, Observable, tap } from 'rxjs';

import config from '../.././../../assets/configs/meters-list/meters.config.json';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { HaysonDict } from 'haystack-core';
import { HaysonGrid } from 'haystack-core';

import { DynamicComponent } from './dynamic.component';

@Component({
  selector: 'app-meters',
  templateUrl: './meters.component.html',
  styleUrls: ['./meters.component.scss'],
})
export class MetersComponent implements OnInit, AfterViewInit {
  constructor(
    private metersStore: RequestReadService,
    private cfr: ComponentFactoryResolver
  ) {}
  @ViewChild('building') bldg: TemplateRef<any> | undefined;
  @ViewChild('editable') editable: TemplateRef<any> | undefined;
  // metersList$: Observable<HDict[] | undefined> = this.metersStore
  //   .getMetersList()
  //   .pipe(
  //     map((list) => {
  //       const rows = list?.limitColumns(['id', 'navName']).getRows();
  //       return rows;
  //     })
  //   );
  tableColumns: TableColumn[] = [];
  tableColumns2: TableColumn[] = [];
  tableRows: Observable<any[] | undefined> = this.metersStore
    .readByFilter(config.costCenters.filter)
    .pipe(
      map((row: HaysonGrid) => {
        const g = HGrid.make(row);
        g.sortBy('storeNum');

        return g.toJSON().rows;
      })
    );

  metersList: Observable<any[] | undefined> = this.metersStore
    .readByFilter(`elec and meter`)
    .pipe(
      map((row) => {
        if (row.rows) this.meters = row.rows;
        return row.rows;
      })
    );
  meters: any[] = [];
  ngOnInit(): void {
    // this.metersStore.getMetersTypes().subscribe();
  }
  st: SelectionType = SelectionType.single;
  ngAfterViewInit(): void {
    this.tableColumns = [
      {
        checkboxable: true,
        sortable: false,
        cellClass: 'text-center',
        maxWidth: 30,
      },
      {
        name: 'Nadrzędny',
        prop: 'costCenterMeterRef',
        cellTemplate: DynamicComponent,
        headerClass: 'text-center',
        cellClass: 'text-start',
        sortable: false,
      },
      {
        name: 'Nazwa',
        prop: 'navName',
        cellTemplate: this.bldg,
        headerClass: 'text-center',
        cellClass: 'text-center',
        sortable: false,
        maxWidth: 250,
      },
      {
        name: 'Opis',
        prop: 'descPL',
        cellTemplate: this.editable,
        headerClass: 'text-center',
        sortable: false,
      },
    ];

    this.tableColumns2 = [
      {
        checkboxable: true,
        maxWidth: 20,
        sortable: false,
      },
      {
        name: 'Nazwa',
        prop: 'id',
        cellTemplate: this.bldg,
        sortable: false,
      },
    ];
  }
  selected: any[] = [];
  activeMeter: string | undefined;
  onSelect(event: any) {
    console.log(event);
    if (!event.selected.length) {
      this.activeMeter = undefined;
      this.selected = [];
    } else {
      this.activeMeter = event.selected[0].id.val;
      this.selected = this.meters.filter((meter) => {
        if (!meter.hasOwnProperty('costCenterMeterRef')) return false;
        else return meter['costCenterMeterRef'].val === this.activeMeter;
      });
    }
  }

  selectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  displayCheck(row: any, column: any, value: any): boolean {
    if (
      row.hasOwnProperty('costCenterMeterRef') &&
      typeof this.activeMeter !== 'undefined'
    )
      return true;

    if (typeof this.activeMeter !== 'undefined')
      return row['costCenterMeterRef'].val === this.activeMeter;
    else return false;
  }

  formatValue(value: any) {
    if (value._kind && value._kind === 'ref') return value.dis;
    return value;
  }

  onDescChange(val: any, row: any, column: any) {
    const q = `readById(@${row.id.val}).set("${column.prop}", "${val.target.value}").recEdit`;
    const e = HStr.make(q).toZinc();
    this.metersStore.readExprAll(e).subscribe();
  }

  rowColors(row: any) {
    return {
      'indirect-production-meter-row': row.hasOwnProperty(
        'indirectProductionTotalMeter'
      ),
      'general-load-total-meter': row.hasOwnProperty('generalLoadTotalMeter'),
      'non-production-meter-row': row.hasOwnProperty('nonProductionTotalMeter'),
      'production-total-meter-row': row.hasOwnProperty('productionTotalMeter'),
      'site-meter-row': row.hasOwnProperty('costCenterSiteMeter'),
    };
  }
}

import { ChangeDetectionStrategy, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SelectionType, TableColumn } from '@swimlane/ngx-datatable';
import { HStr } from 'haystack-core';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import {
  createTableColumnsConfig,
  formatHaystackValue,
} from '../../utils/utils.functions';

@Component({
  selector: 'app-meter-data-table',
  templateUrl: './meter-data-table.component.html',
  styleUrls: ['./meter-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterDataTableComponent implements AfterViewInit {
  @ViewChild('display') display: TemplateRef<any> | undefined;
  @ViewChild('edit') edit: TemplateRef<any> | undefined;

  @Input('selectType') selectionType: SelectionType = SelectionType.single;
  @Input('columnsConfig') columnsConfig: any;
  @Input('rows') rows: any[] | undefined | null;
  @Input('selected') selected: any[] = [];
  @Input('displayCheck') displayCheck = (row: any, column: any, value: any) =>
    true;

  @Output() selectionChanged = new EventEmitter<any[]>();
  @Output() checkboxActivate = new EventEmitter<any>();
  columns: TableColumn[] = [];

  constructor(private req: RequestReadService) {}

  ngAfterViewInit(): void {
    this.columns = createTableColumnsConfig(this.columnsConfig, this);
  }

  formatValue(value: any) {
    return formatHaystackValue(value);
  }

  onParameterChange(value: any, row: any, column: any) {
    const query = `readById(@${row.id.val}).set("${column.prop}", "${value.target.value}").recEdit`;
    const zincQuery = HStr.make(query).toZinc();
    this.req.readExprAll(zincQuery).subscribe();
  }

  rowColors(row: any) {
    return {
      'indirect-production-meter-row':
        row.hasOwnProperty('indirectProductionTotalMeter') ||
        row.hasOwnProperty('compressorsTotalMeter') ||
        row.hasOwnProperty('compressorsMeter') ||
        row.hasOwnProperty('ventilationTotalMeter') ||
        row.hasOwnProperty('ventilationMeter'),
      'general-load-total-meter':
        row.hasOwnProperty('generalLoadTotalMeter') ||
        row.hasOwnProperty('generalLoadMeter'),
      'non-production-meter-row':
        row.hasOwnProperty('nonProductionTotalMeter') ||
        row.hasOwnProperty('nonProductionMeter'),
      'production-total-meter-row':
        row.hasOwnProperty('productionTotalMeter') ||
        row.hasOwnProperty('productionDepartmentMeter'),
      'production-meter-row': row.hasOwnProperty('productionLineMeter'),
      'site-meter-row': row.hasOwnProperty('costCenterSiteMeter'),
    };
  }

  rowIdentity(row: any) {
    return row.id.val;
  }

  onSelect({ selected }: any) {
    // this.selected.splice(0, this.selected.length);
    // this.selected.push(...selected);
    this.selected = selected;
    this.selectionChanged.emit(this.selected);
  }

  selectCheck(row: any) {
    return this.selected.indexOf(row) === -1;
  }

  onActivate(event: any) {
    if (event.type !== 'checkbox') return;
    this.checkboxActivate.emit(event.row);
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HDict, HGrid, HNum } from 'haystack-core';
import { UpdateValueService } from '../../services/update-value.service';

@Component({
  selector: 'app-number-edit-column',
  templateUrl: './number-edit-column.component.html',
  styleUrls: ['./number-edit-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberEditColumnComponent implements OnInit {
  @Input() row: HDict | undefined;
  @Input() column: TableColumn | undefined;
  @Input() grid: HGrid | undefined;
  constructor(private service: UpdateValueService) {}
  haystackNum: HNum | undefined;
  val: number | undefined;
  unit: string | undefined;

  private actionType: 'function' | 'override' = 'override';
  private funcName: string | undefined;
  private stepSize: number = 1;

  private id: string | undefined;
  private prop: string | undefined;

  ngOnInit(): void {
    const columnName = this.column?.prop?.toString();
    if (!!columnName) {
      this.haystackNum = this.row?.get<HNum>(columnName);
      this.val = this.haystackNum?.value;
      this.unit = this.haystackNum?.unit?.symbol;

      this.id = this.row?.get('id')?.toZinc(true);
      this.prop = this.column?.prop?.toString();

      const haystackColumn = this.grid?.getColumn(columnName);

      this.stepSize = Number(haystackColumn?.meta.get('stepSize')) ?? 1;
      this.actionType =
        (haystackColumn?.meta.get('actionType')?.toString() as
          | 'function'
          | 'override') ?? 'override';

      this.funcName = haystackColumn?.meta.get('funcName')?.toString();
    }
  }

  onMinus() {
    if (!!this.haystackNum && !!this.val) {
      this.haystackNum = this.haystackNum.minus(HNum.make(this.stepSize));
      this.val = this.haystackNum.value;
      this.onChange();
    }
  }

  onPlus() {
    if (!!this.haystackNum && !!this.val) {
      this.haystackNum = this.haystackNum.plus(HNum.make(this.stepSize));
      this.val = this.haystackNum.value;
      this.onChange();
    }
  }

  onChange() {
    if (
      this.actionType === 'override' &&
      !!this.id &&
      !!this.prop &&
      !!this.val
    ) {
      this.service.updateValue(
        this.id,
        this.prop,
        `${this.val}${this.unit ?? ''}`,
        'number'
      );
    } else if (
      this.actionType === 'function' &&
      !!this.id &&
      !!this.prop &&
      !!this.val &&
      !!this.funcName
    ) {
      this.service.invokeFunction(
        this.id,
        this.prop,
        this.funcName,
        this.val.toString()
      );
    }
  }
}

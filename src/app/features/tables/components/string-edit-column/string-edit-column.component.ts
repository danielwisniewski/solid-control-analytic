import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HDict, HaysonDict } from 'haystack-core';
import { UpdateValueService } from '../../services/update-value.service';

@Component({
  selector: 'app-string-edit-column',
  templateUrl: './string-edit-column.component.html',
  styleUrls: ['./string-edit-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringEditColumnComponent implements OnInit {
  @Input() set row(r: HaysonDict | undefined) {
    this.dictRow = HDict.make(r);
  }
  @Input() column: TableColumn | undefined;
  @Input() value: string | undefined;

  @Output() onValueChange = new EventEmitter();

  dictRow: HDict | undefined;
  constructor(private service: UpdateValueService) {}

  updateValue() {
    const hasId = !!this.dictRow?.get('id')?.toZinc(true);
    if (!hasId) return;
    const id = this.dictRow!.get('id')!.toZinc(true);
    const parameter = this.column?.prop?.toString();
    if (!!parameter && !!this.value)
      this.service.updateValue(id, parameter, this.value);
  }

  ngOnInit(): void {}
}

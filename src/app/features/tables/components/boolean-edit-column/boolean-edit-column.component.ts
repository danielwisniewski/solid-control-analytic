import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HaysonDict, HDict, HGrid, HMarker } from 'haystack-core';
import { UpdateValueService } from '../../services/update-value.service';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import { changeActivePanelId } from 'src/app/core/store/pages/panels.actions';

@Component({
  selector: 'app-boolean-edit-column',
  templateUrl: './boolean-edit-column.component.html',
  styleUrls: ['./boolean-edit-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooleanEditColumnComponent implements OnInit {
  @Input() row: HaysonDict | undefined;
  @Input() grid: HGrid | undefined;
  @Input() column: TableColumn | undefined;
  @Input() value: boolean | undefined;

  private actionType: 'function' | 'override' = 'override';
  private funcName: string | undefined;
  private id: string | undefined;
  private prop: string | undefined;

  private dictRow: HDict | undefined;
  constructor(
    private service: UpdateValueService,
    private store: Store<AppState>
  ) {}

  onClick() {
    this.value = !this.value;
    const panelId = this.grid?.meta.get('panelId');
    if (!!panelId)
      this.store.dispatch(changeActivePanelId({ id: panelId.toString() }));
    this.action();
  }

  ngOnInit(): void {
    this.prop = this.column?.prop?.toString();
    if (!this.prop) return;
    if (!!this.row) {
      this.dictRow = HDict.make(this.row);
      this.id = this.dictRow.get('id')?.toZinc(true);

      const haystackColumn = this.grid?.getColumn(this.prop);

      this.actionType =
        (haystackColumn?.meta.get('actionType')?.toString() as
          | 'function'
          | 'override') ?? 'override';

      this.funcName = haystackColumn?.meta.get('funcName')?.toString();
    }
  }

  action() {
    if (!this.id || !this.prop) return;
    if (this.actionType === 'override') {
      this.service.updateMarker(this.id, this.prop, !!this.value);
    } else if (this.actionType === 'function' && !!this.funcName) {
      this.service.invokeFunction(
        this.id,
        this.prop,
        this.funcName,
        !!this.value
      );
    }
  }
}

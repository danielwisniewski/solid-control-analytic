import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HDict, HGrid, HaysonDict } from 'haystack-core';
import swal from 'sweetalert2';
import { UpdateValueService } from '../../services/update-value.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { changeActivePanelId } from 'src/app/core/store/pages/panels.actions';

@Component({
  selector: 'app-delete-button-column',
  templateUrl: './delete-button-column.component.html',
  styleUrls: ['./delete-button-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteButtonColumnComponent implements OnInit {
  @Input() set row(r: HaysonDict | undefined) {
    this.dictRow = HDict.make(r);
    this.id = this.dictRow?.get('id')?.toZinc(true);
    this.prop = this.column?.prop?.toString();
  }
  @Input() column: TableColumn | undefined;
  @Input() value: boolean | undefined;
  @Input() grid: HGrid | undefined;

  constructor(
    private service: UpdateValueService,
    private store: Store<AppState>
  ) {}
  displayTag: string = 'deleteButton';

  private dictRow: HDict | undefined;

  private actionType: 'function' | 'override' = 'override';
  private funcName: string | undefined;
  private id: string | undefined;
  private prop: string | undefined;

  ngOnInit(): void {
    if (!this.prop) return;

    const haystackColumn = this.grid?.getColumn(this.prop);

    this.actionType =
      (haystackColumn?.meta.get('actionType')?.toString() as
        | 'function'
        | 'override') ?? 'override';

    this.funcName = haystackColumn?.meta.get('funcName')?.toString();
  }

  onDelete() {
    if (!this.id) return;

    const panelId = this.grid?.meta.get('panelId')?.toString();
    if (!!panelId) this.store.dispatch(changeActivePanelId({ id: panelId }));

    swal
      .fire({
        title: 'Czy jesteś pewien?',
        text: `Po usunięciu nie ma opcji cofnij. ${
          !!this.row ? this.row['navName'] : 'Element'
        } zostanie trwale usunięty z systemu.`,

        icon: 'warning',
        showCancelButton: true,
        customClass: {
          cancelButton: 'btn btn-success',
          confirmButton: 'btn btn-danger mr-1',
        },
        confirmButtonText: 'Usuń',
        cancelButtonText: 'Anuluj',

        buttonsStyling: false,
      })
      .then((result) => {
        if (result.value) {
          if (this.actionType === 'override' && !!this.id) {
            this.service.deleteElement(this.id);
          }
        }
      });
  }
}

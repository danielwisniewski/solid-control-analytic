import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HDict, HGrid, HaysonDict } from 'haystack-core';
import swal from 'sweetalert2';
import { UpdateValueService } from '../../services/update-value.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import { changeActivePanelId } from 'src/app/core/store/pages/panels.actions';
type ActionType = 'function' | 'link' | 'details' | 'functionInput';
type ButtonType = 'text' | 'icon';
type ButtonColor = 'primary' | 'info' | 'success' | 'warning' | 'danger';

interface FunctionInputParameters {
  id: string;
  text: string;
  type: string;
  help?: string;
}

@Component({
  selector: 'app-button-action-column',
  templateUrl: './button-action-column.component.html',
  styleUrls: ['./button-action-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonActionColumnComponent implements OnInit {
  @Input() set row(r: HaysonDict | undefined) {
    this.dictRow = HDict.make(r);
    this.id = this.dictRow?.get('id')?.toZinc(true);
    this.prop = this.column?.prop?.toString();
    this.assignValues();
  }
  @Input() column: TableColumn | undefined;
  @Input() value: boolean | undefined;
  @Input() grid: HGrid | undefined;

  constructor(
    private service: UpdateValueService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  private id: string | undefined;
  private prop: string | undefined;

  private dictRow: HDict | undefined;
  private actionType: ActionType = 'function';

  private funcName: string | undefined;
  private linkPath: string | undefined;

  buttonType: ButtonType = 'text';
  buttonText: string = '+';
  buttonIcon: string = 'icon-pencil';
  buttonColor: ButtonColor = 'success';

  private functionInputParameters: FunctionInputParameters[] = [];

  assignValues() {
    if (!this.prop) return;
    const column = this.grid?.getColumn(this.prop);

    this.actionType =
      (column?.meta.get('actionType')?.toString() as ActionType) ?? 'function';
    this.funcName = column?.meta.get('funcName')?.toString();
    this.linkPath = column?.meta.get('link')?.toString();

    this.buttonType =
      (column?.meta.get('buttonType')?.toString() as ButtonType) ?? 'text';
    this.buttonText = column?.meta.get('buttonText')?.toString() ?? '+';
    this.buttonIcon =
      column?.meta.get('buttonIcon')?.toString() ?? 'icon-pencil';

    this.buttonColor =
      (column?.meta.get('buttonColor')?.toString() as ButtonColor) ?? 'success';

    this.functionInputParameters =
      (column?.meta
        .get('functionInputParameters')
        ?.toJSON() as FunctionInputParameters[]) ?? [];
  }

  ngOnInit(): void {
    this.id = this.dictRow?.get('id')?.toZinc(true);
    this.prop = this.column?.prop?.toString();
    this.assignValues();
  }

  onClick() {
    const panelId = this.grid?.meta.get('panelId')?.toString();
    if (!!panelId) this.store.dispatch(changeActivePanelId({ id: panelId }));
    if (this.actionType === 'functionInput') this.inputFunction();
    else if (this.actionType === 'link') {
      if (!!this.linkPath) this.router.navigateByUrl(this.linkPath);
    } else if (this.actionType === 'details') {
      if (!!this.id)
        this.router.navigate([this.id], { relativeTo: this.activatedRoute });
    } else if (this.actionType === 'function') {
      if (!!this.id && this.prop && this.funcName)
        this.service.invokeFunction(this.id, this.prop, this.funcName, true);
    }
  }

  private inputFunction() {
    if (!(!!this.prop && !!this.funcName)) return;
    swal
      .fire({
        title: 'Wymagane dodatkowe informacje',
        html: this.generateInputsForms(),
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-success mr-1',
          cancelButton: 'btn btn-warning',
        },
        confirmButtonText: 'Dodaj',
        cancelButtonText: 'Anuluj',
        buttonsStyling: false,
      })
      .then((result) => {
        if (!result.value) return;
        if (!this.readEnteredValues()) {
          swal.fire({
            title: 'Błąd!',
            text: 'Wprowadzone dane są błędne. Spróbuj ponownie.',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-success',
            },
            buttonsStyling: false,
          });
        } else {
          if (!!this.readEnteredValues()) {
            this.service.invokeFunction(
              this.id ?? '',
              this.prop!,
              this.funcName!,
              JSON.stringify(this.readEnteredValues())
            );
          }
        }
      });
  }

  private generateInputsForms(): string {
    let result: string = '';
    for (let index = 0; index < this.functionInputParameters.length; index++) {
      const text = `<div class="form-group">
      <label for="${this.functionInputParameters[index].id}">${
        this.functionInputParameters[index].text
      }</label>
      <input id="${this.functionInputParameters[index].id}" type="${
        this.functionInputParameters[index].type ?? 'text'
      }" class="form-control" style="color: black"/>
      <small class="form-text text-muted">${
        this.functionInputParameters[index].help ?? ''
      }</small>
      </div>`;
      result = result + text;
    }
    return result;
  }

  private readEnteredValues(): Object | undefined {
    let result = {};
    for (let index = 0; index < this.functionInputParameters.length; index++) {
      const elementId = this.functionInputParameters[index].id;
      const elementValue = (
        document.getElementById(elementId) as HTMLInputElement
      ).value;
      if (!elementValue) return undefined;
      result = {
        ...result,
        [elementId]: elementValue,
      };
    }
    return result;
  }
}

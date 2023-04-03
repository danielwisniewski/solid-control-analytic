import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HaysonGrid, HStr } from 'haystack-core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { startWith, switchMap } from 'rxjs';
import { finalize } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';
import { formatHaystackValue, queryToZinc } from '../../utils/utils.functions';

@Component({
  selector: 'app-cost-centers-table',
  templateUrl: './cost-centers-table.component.html',
  styleUrls: ['./cost-centers-table.component.scss'],
})
export class CostCentersTableComponent implements OnInit {
  constructor(
    private siteService: SiteStoreService,
    private req: RequestReadService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}
  @ViewChild('display') display: TemplateRef<any> | undefined;
  @ViewChild('edit') edit: TemplateRef<any> | undefined;
  @ViewChild('buttonColumn') buttonColumn: TemplateRef<any> | undefined;
  @ViewChild('delete') deleteModal: TemplateRef<any> | undefined;
  @ViewChild('add') addModal: TemplateRef<any> | undefined;

  modalRef?: BsModalRef;

  table$ = this.siteService.activeSite$
    .pipe(
      filter((site) => !!site && !!site.get('id')),
      map((site) => site?.get('id')?.toZinc(true)),
      switchMap((siteId) => {
        const query = `costCenterTable(${siteId})`;
        return this.req.readExprAll(queryToZinc(query)).pipe(
          tap((res) => {
            this.generateTableColumns(res);
            this.tableRows = res.rows ?? [];
          }),
          startWith([])
        );
      })
    )
    .subscribe();

  tableColumns: TableColumn[] = [];
  tableRows: any[] = [];

  ngOnInit(): void {}

  private generateTableColumns(response: HaysonGrid): void {
    this.tableColumns = [];
    response.cols?.forEach((column) => {
      if (column.meta && column.meta['visible']) {
        this.tableColumns.push({
          name: column.meta['dis']?.toString(),
          prop: column.name,
          headerClass: 'text-center',
          cellClass: 'text-start',
          sortable: false,
          cellTemplate:
            column.meta['cellName'] == 'stringEdit' ? this.edit : this.display,
        });
      }
    });
    this.tableColumns.push({
      headerClass: 'text-center',
      cellClass: 'text-start',
      sortable: false,
      cellTemplate: this.buttonColumn,
      maxWidth: 150,
    });
  }

  costCenterToDelete: any | undefined = undefined;
  costCenterToAdd: any | undefined = undefined;

  formatValue(value: any) {
    return formatHaystackValue(value);
  }

  onParameterChange(value: any, row: any, column: any) {
    const query = `readById(@${row.id.val}).set("${column.prop}", "${value.target.value}").recEdit`;
    const zincQuery = HStr.make(query).toZinc();
    this.req.readExprAll(zincQuery).subscribe();
  }

  onDeleteButton(row: any) {
    if (this.deleteModal) {
      this.modalRef = this.modalService.show(this.deleteModal);
      this.costCenterToDelete = row;
    }
  }

  onAddButton(row: any) {
    if (this.addModal) {
      this.modalRef = this.modalService.show(this.addModal);
      this.costCenterToAdd = row;
    }
  }

  deleteMeter() {
    if (typeof this.costCenterToDelete !== 'undefined') {
      const id = `@${this.costCenterToDelete.id.val}`;
      const query = `readById(${id}).recDelete`;
      this.req
        .readExprAll(queryToZinc(query))
        .pipe(
          finalize(() => {
            this.costCenterToDelete = undefined;
            this.siteService.activeSite$.next(
              this.siteService.activeSite$.getValue()
            );
          })
        )
        .subscribe((res) => {
          if (res.rows && res.rows.length > 0) {
            this.toastr.success(`Centrum kosztowe zostało usunięte.`, 'Sukces');
          } else {
            this.toastr.error(
              `Wystąpił problem podczas usuwania centrum kosztowego. ${
                res.meta!['errTrace']
              }`,
              'Błąd',
              { closeButton: true }
            );
          }
        });
    }
  }

  submitForm(form: NgForm) {
    const values = form.value;
    const query = `scAddCostCenter("${values.centerName}", "${values.centerDesc}", @${this.costCenterToAdd.id.val})`;
    this.req
      .readExprAll(queryToZinc(query))
      .pipe(
        finalize(() => {
          this.costCenterToAdd = [];
          this.siteService.activeSite$.next(
            this.siteService.activeSite$.getValue()
          );
          this.modalService.hide();
        })
      )
      .subscribe((res) => {
        if (res.rows && res.rows.length > 0) {
          this.toastr.success(
            `Centrum kosztowe ${res.rows[0][
              'navName'
            ]?.toString()} zostało dodane.`,
            'Sukces'
          );
        } else {
          this.toastr.error(
            `Wystąpił problem podczas dodawania centrum kosztowego. ${
              res.meta!['errTrace']
            }`,
            'Błąd',
            { closeButton: true }
          );
        }
      });
  }

  rowColors(row: any) {
    return {
      'indirect-production-meter-row':
        row.hasOwnProperty('indirectProductionMeter') ||
        row.hasOwnProperty('compressorsMeter') ||
        row.hasOwnProperty('ventilationMeter'),
      'general-load-total-meter':
        row.hasOwnProperty('generalLoadTotalMeter') ||
        row.hasOwnProperty('generalLoadMeter'),
      'non-production-meter-row':
        row.hasOwnProperty('nonProductionTotalMeter') ||
        row.hasOwnProperty('nonProductionMeter'),
      'production-total-meter-row': row.hasOwnProperty(
        'productionDepartmentMeter'
      ),
      'production-total-row':
        row.hasOwnProperty('productionTotalMeter') ||
        row.hasOwnProperty('indirectProductionTotalMeter') ||
        row.hasOwnProperty('compressorsTotalMeter') ||
        row.hasOwnProperty('ventilationTotalMeter'),
      'production-meter-row': row.hasOwnProperty('productionLineMeter'),
      'site-meter-row': row.hasOwnProperty('costCenterSiteMeter'),
    };
  }
}

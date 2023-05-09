import { Injectable, TemplateRef } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HDict, HRef, HStr, HaysonGrid } from 'haystack-core';
import { catchError, finalize, startWith, take } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { ToastrPopupService } from '../../../core/services/toastr-popup.service';
import { queryToZinc } from '../utils/utils.functions';

import { map } from 'rxjs';
import { SiteStore } from 'src/app/core/store/site.store';
@Injectable({
  providedIn: 'root',
})
export class CostCentersService {
  constructor(
    private req: RequestReadService,
    private message: ToastrPopupService,
    private siteService: SiteStore
  ) {}

  generateTableColumns(
    response: HaysonGrid | null,
    editTemplate: TemplateRef<any> | undefined,
    displayTemplate: TemplateRef<any> | undefined,
    buttonTemplate: TemplateRef<any> | undefined
  ): TableColumn[] {
    const tableColumns: TableColumn[] = [];
    response?.cols?.forEach((column, index) => {
      if (column.meta && column.meta['visible']) {
        tableColumns.push({
          name: column.meta['dis']?.toString(),
          prop: column.name,
          isTreeColumn:
            column.name === 'id' ||
            column.name === 'costCenterMeterRef' ||
            column.name === 'navName',
          headerClass: 'text-center',
          cellClass: 'text-start',
          sortable: false,
          cellTemplate:
            column.meta['cellName'] == 'stringEdit'
              ? editTemplate
              : displayTemplate,
        });
      }
    });
    tableColumns.push({
      headerClass: 'text-center',
      cellClass: 'text-start',
      sortable: false,
      cellTemplate: buttonTemplate,
      maxWidth: 150,
    });

    return tableColumns;
  }

  changeSkysparkParameter(value: any, row: any, column: any): void {
    const query = `readById(@${row.id.val}).set("${column.prop}", "${value.target.value}").recEdit`;
    const zincQuery = HStr.make(query).toZinc();
    this.req
      .readExprAll(zincQuery)
      .pipe(
        take(1),
        catchError((err) => {
          this.message.displayErrorMessage(
            `Nie udało się zmienić opisu. \n ${err.message}`
          );
          return err;
        })
      )
      .subscribe((res: any) => {
        this.message.displaySuccessMessage(
          `Zmieniono opis dla Centrum kosztowego: ${res.rows[0]['navName']}`
        );
      });
  }

  deleteCostCenterFromSkyspark(costCenterToDelete: any): void {
    if (typeof costCenterToDelete !== 'undefined') {
      const id = `@${costCenterToDelete.id.val}`;
      const query = `readById(${id}).recDelete`;
      this.req
        .readExprAll(queryToZinc(query))
        .pipe(
          take(1),
          finalize(() => {
            this.siteService.activeSite$.next(
              this.siteService.activeSite$.getValue()
            );
          })
        )
        .subscribe((res) => {
          if (res.rows && res.rows.length > 0) {
            this.message.displaySuccessMessage(
              'Centrum kosztowe zostało usunięte.'
            );
          } else {
            this.message.displayErrorMessage(
              `Wystąpił problem podczas usuwania centrum kosztowego. ${
                res.meta!['errTrace']
              }`
            );
          }
        });
    } else {
      this.message.displayErrorMessage('Dane centrum kosztowe nie istnieje.');
    }
  }

  addCostCenterToSkyspark(values: any, costCenterToAdd: any): void {
    const query = `scAddCostCenter("${values.centerName}", "${values.centerDesc}", @${costCenterToAdd.id.val})`;

    this.req
      .readExprAll(queryToZinc(query))
      .pipe(
        take(1),
        finalize(() => {
          this.siteService.activeSite$.next(
            this.siteService.activeSite$.getValue()
          );
        })
      )
      .subscribe((res) => {
        if (res.rows && res.rows.length > 0) {
          this.message.displaySuccessMessage(
            `Centrum kosztowe ${res.rows[0][
              'navName'
            ]?.toString()} zostało dodane.`
          );
        } else {
          this.message.displayErrorMessage(
            `Wystąpił problem podczas dodawania centrum kosztowego. ${
              res.meta!['errTrace']
            }`
          );
        }
      });
  }

  addGasStationToSkyspark(values: any) {
    const query = `scAddGasStation("${values.centerName}", "${
      values.centerDesc
    }", ${this.siteService.activeSite$.getValue()?.get('id')?.toZinc(true)})`;

    this.req
      .readExprAll(queryToZinc(query))
      .pipe(
        take(1),
        finalize(() => {
          this.siteService.activeSite$.next(
            this.siteService.activeSite$.getValue()
          );
        })
      )
      .subscribe((res) => {
        if (res.rows && res.rows.length > 0) {
          this.message.displaySuccessMessage(
            `Stacja gazowa ${res.rows[0][
              'navName'
            ]?.toString()} została dodana.`
          );
        } else {
          this.message.displayErrorMessage(
            `Wystąpił problem podczas dodawania stacji gazowej. ${
              res.meta!['errTrace']
            }`
          );
        }
      });
  }

  getCostCenterTable(siteId: string) {
    const query = `costCenterTable(${siteId})`;
    return this.req.readExprAll(queryToZinc(query)).pipe(
      map((res: HaysonGrid) => {
        return res;
      }),
      startWith([])
    );
  }

  private rowExpanded: string[] = [];

  onTreeAction(row: HDict, action: 'expand' | 'collapse') {
    console.log(row);
    const id = row.get<HRef>('id')?.toZinc(true);
    if (action === 'expand') {
      if (id !== null && typeof id !== 'undefined') this.rowExpanded.push(id);
    } else if (action === 'collapse') {
      const index = this.rowExpanded.findIndex((r) => r === id);
      if (index > -1) delete this.rowExpanded[index];
    }
    console.log(this.rowExpanded);
  }

  shouldBeExpanded(row: HDict): 'collapsed' | 'expanded' {
    const id = row.get('id')?.toZinc(true);
    console.log();
    if (this.rowExpanded.findIndex((r) => r === id) > -1) return 'expanded';
    else return 'collapsed';
  }
}

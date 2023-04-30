import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HDict, HaysonGrid } from 'haystack-core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Subscription, tap } from 'rxjs';
import { startWith, switchMap } from 'rxjs';
import { filter, map } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import {
  formatHaystackValue,
  generateRowColors,
  queryToZinc,
  templateLogic,
} from '../../utils/utils.functions';
import { CostCentersService } from '../../services/cost-centers.service';
import { ActivatedRoute } from '@angular/router';
import { SiteStore } from 'src/app/core/store/site.store';

@Component({
  selector: 'app-cost-centers-table',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.scss'],
})
export class CostCentersComponent implements OnInit, OnDestroy {
  constructor(
    private siteService: SiteStore,
    private req: RequestReadService,
    private modalService: BsModalService,
    private costCentersService: CostCentersService,
    private route: ActivatedRoute
  ) {}

  isGas: boolean = this.route.snapshot.url[0].path.includes('gas');
  ngOnInit(): void {}
  @ViewChild('display') display: TemplateRef<any> | undefined;
  @ViewChild('edit') edit: TemplateRef<any> | undefined;
  @ViewChild('buttonColumn') buttonColumn: TemplateRef<any> | undefined;
  @ViewChild('delete') deleteModal: TemplateRef<any> | undefined;
  @ViewChild('add') addModal: TemplateRef<any> | undefined;

  modalRef?: BsModalRef;
  tableDataSubscription$: Subscription = this.siteService.activeSite$
    .pipe(
      filter((site) => !!site && !!site.get('id')),
      map((site) => site?.get('id')?.toZinc(true)),
      switchMap((siteId) => {
        const query = `costCenterTable(${siteId}, "${
          this.isGas ? 'gas' : 'elec'
        }")`;
        return this.req.readExprAll(queryToZinc(query)).pipe(
          tap((res) => {
            this.tableColumns = this.generateTableColumns(res);
            const d = res.rows?.map((row) => {
              return {
                ...row,
                treeStatus: this.costCentersService.shouldBeExpanded(
                  HDict.make(row)
                ),
              };
            });
            this.tableRows = d ?? [];
          }),
          startWith([])
        );
      })
    )
    .subscribe();

  tableColumns: TableColumn[] = [];
  tableRows: any[] = [];

  costCenterToDelete: any | undefined = undefined;
  costCenterToAdd: any | undefined = undefined;

  private generateTableColumns(response: HaysonGrid | null): TableColumn[] {
    return this.costCentersService.generateTableColumns(
      response,
      this.edit,
      this.display,
      this.buttonColumn
    );
  }

  formatValue(value: any) {
    return formatHaystackValue(value);
  }

  onParameterChange(value: any, row: any, column: any) {
    this.costCentersService.changeSkysparkParameter(value, row, column);
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
      if (!this.isGas) this.costCenterToAdd = row;
    }
  }

  deleteMeter() {
    this.costCentersService.deleteCostCenterFromSkyspark(
      this.costCenterToDelete
    );
  }

  submitForm(form: NgForm) {
    if (!this.isGas) {
      this.costCentersService.addCostCenterToSkyspark(
        form.value,
        this.costCenterToAdd
      );
    } else {
      this.costCentersService.addGasStationToSkyspark(form.value);
    }
  }

  rowColors(row: any) {
    return generateRowColors(row);
  }

  templateLogic(row: any) {
    return templateLogic(row);
  }

  ngOnDestroy(): void {
    this.tableDataSubscription$.unsubscribe();
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'expanded';
      this.costCentersService.onTreeAction(HDict.make(row), 'expand');
    } else {
      row.treeStatus = 'collapsed';
      this.costCentersService.onTreeAction(HDict.make(row), 'collapse');
    }
    this.tableRows = [...this.tableRows];
  }
}

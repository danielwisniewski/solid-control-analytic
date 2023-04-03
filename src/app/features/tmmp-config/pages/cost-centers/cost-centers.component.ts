import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { TableColumn } from '@swimlane/ngx-datatable';
import { HaysonGrid, HStr } from 'haystack-core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, tap } from 'rxjs';
import { startWith, switchMap } from 'rxjs';
import { finalize } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';
import {
  formatHaystackValue,
  generateRowColors,
  queryToZinc,
  templateLogic,
} from '../../utils/utils.functions';
import { CostCentersService } from '../../services/cost-centers.service';

@Component({
  selector: 'app-cost-centers-table',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.scss'],
})
export class CostCentersComponent implements OnDestroy {
  constructor(
    private siteService: SiteStoreService,
    private req: RequestReadService,
    private modalService: BsModalService,
    private costCentersService: CostCentersService
  ) {}
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
        const query = `costCenterTable(${siteId})`;
        return this.req.readExprAll(queryToZinc(query)).pipe(
          tap((res) => {
            this.tableColumns = this.generateTableColumns(res);
            this.tableRows = res.rows ?? [];
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
      this.costCenterToAdd = row;
    }
  }

  deleteMeter() {
    this.costCentersService.deleteCostCenterFromSkyspark(
      this.costCenterToDelete
    );
  }

  submitForm(form: NgForm) {
    this.costCentersService.addCostCenterToSkyspark(
      form.value,
      this.costCenterToAdd
    );
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
}

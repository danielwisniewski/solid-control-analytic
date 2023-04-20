import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HStr } from 'haystack-core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';

@Component({
  selector: 'app-gas-stations',
  templateUrl: './gas-stations.component.html',
  styleUrls: ['./gas-stations.component.scss'],
})
export class GasStationsComponent implements OnInit {
  constructor(
    private modalService: BsModalService,
    private req: RequestReadService
  ) {}
  @ViewChild('add') addModal: TemplateRef<any> | undefined;

  modalRef?: BsModalRef;

  ngOnInit(): void {}

  onAddButton() {
    // if (this.addModal) {
    //   this.modalRef = this.modalService.show(this.addModal);
    // }

    const viewName = 'tableReport';
    const state = `{ funcData:"ventilationReportChart(4, toDateSpan(2023-03-17..2023-04-17),@p:demo:r:2b53edc4-5beb7fdc)" }`;
    this.req.generateExportRequest(viewName, state, 'test');
  }

  submitForm(form: NgForm) {
    console.log(form);
  }
}

import { Injectable } from '@angular/core';
import { HStr } from 'haystack-core';
import { catchError, finalize, take, tap } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { ToastrPopupService } from 'src/app/core/services/toastr-popup.service';
import swal from 'sweetalert2';
import { DashboardStore } from '../../dashboard/store/dashboard.store';
import { queryToZinc } from 'src/app/core/functions/utils';

@Injectable({
  providedIn: 'root',
})
export class UpdateValueService {
  constructor(
    private req: RequestReadService,
    private message: ToastrPopupService,
    private dashboardStore: DashboardStore
  ) {}

  updateValue(id: string, prop: string, value: string, type = 'string') {
    const val = type === 'string' ? `"${value}"` : value;
    const query = `readById(${id}).set("${prop}", ${val}).recEdit`;
    const zincQuery = HStr.make(query).toZinc();

    this.req
      .readExprAll(zincQuery)
      .pipe(
        take(1),
        catchError((err) => {
          this.message.displayErrorMessage(
            `Wystąpił problem podczas wykonywania zmiany. \n ${err.message}`
          );
          return err;
        })
      )
      .subscribe((res: any) => {
        this.message.displaySuccessMessage(`Wykonano zmianę pomyślnie.`);
      });
  }

  updateMarker(id: string, prop: string, value: boolean) {
    const query = `readById(${id}).set("${prop}", ${
      value ? 'marker()' : 'removeMarker()'
    }).recEdit`;
    const zincQuery = HStr.make(query).toZinc();

    this.req
      .readExprAll(zincQuery)
      .pipe(
        take(1),
        catchError((err) => {
          this.message.displayErrorMessage(
            `Wystąpił problem podczas wykonywania zmiany. \n ${err.message}`
          );
          return err;
        })
      )
      .subscribe((res: any) => {
        this.message.displaySuccessMessage(`Wykonano zmianę pomyślnie.`);
      });
  }

  deleteElement(id: string) {
    const query = `readById(${id}).recDelete`;
    const zincQuery = queryToZinc(query);
    this.req
      .readExprAll(zincQuery)
      .pipe(
        take(1),
        finalize(() => {
          this.dashboardStore.triggerDataUpdate$.next(true);
        })
      )
      .subscribe(() => {
        swal.fire({
          title: 'Usunięto!',
          text: 'Usunięto pomyślnie',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-success',
          },
          buttonsStyling: false,
        });
      });
  }

  invokeFunction(
    id: string,
    prop: string,
    func: string,
    value: string | boolean | Object
  ) {
    let parameters = {};

    if (!!this.dashboardStore.detailsPageId$.getValue()) {
      parameters = {
        ...parameters,
        detailPageId: this.dashboardStore.detailsPageId$.getValue(),
      };
    }

    const jsonParameters =
      Object.keys(parameters).length > 0
        ? `, ${JSON.stringify(parameters)}`
        : '';

    const query = `${func}(${id}, "${prop}", ${value}${jsonParameters})`;
    const zincQuery = HStr.make(query).toZinc();

    this.req
      .readExprAll(zincQuery)
      .pipe(
        take(1),
        tap((res) => {
          if (!!res.meta && !!res.meta['err'] && !!res.meta['dis'])
            throw new Error(res.meta['dis'].toString());
        }),
        catchError((err) => {
          swal.fire({
            title: 'Błąd!',
            text: err,
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-success',
            },
            buttonsStyling: false,
          });
          return err;
        }),
        finalize(() => {
          this.dashboardStore.triggerDataUpdate$.next(true);
        })
      )
      .subscribe((res: any) => {
        swal.fire({
          title: 'Sukces',
          text: 'Wprowadzono zmianę pomyślnie.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-success',
          },
          buttonsStyling: false,
        });
      });
  }
}

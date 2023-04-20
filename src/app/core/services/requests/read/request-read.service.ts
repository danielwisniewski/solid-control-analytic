import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HaysonGrid, HGrid, HRef } from 'haystack-core';
import {
  catchError,
  filter,
  interval,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth-service.service';
import { ToastrPopupService } from 'src/app/features/tmmp-config/services/toastr-popup.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestReadService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastrPopup: ToastrPopupService
  ) {}

  readByFilter(filter: string): Observable<HaysonGrid> {
    const text = `ver:"3.0"
    filter
    "${filter}"`;

    return this.http.post(`${environment.skysparkServer}/read`, text).pipe(
      catchError((err) => {
        console.log('Handling error locally and rethrowing it...', err);
        this.toastrPopup.displayErrorMessage(
          err.message,
          'Nie udało się pobrać danych'
        );
        if (err.status === 403) {
          localStorage.setItem('token', '');
          this.authService.userLoggedIn$.next(false);
        }
        return throwError(err);
      })
    );
  }

  readById(request: HGrid | HRef | undefined): Observable<HaysonGrid> {
    let idToRequest = '';

    if (request instanceof HGrid) {
      const convertedIdList = request.listBy('id').map((r) => r?.toZinc());
      convertedIdList.forEach((id) => (idToRequest += id + '\n'));
    } else if (request instanceof HRef) {
      idToRequest = request.toZinc();
    }

    const text = `ver:"3.0"
    id
    ${idToRequest}`;

    return this.http.post(`${environment.skysparkServer}/read`, text).pipe(
      catchError((err) => {
        console.log('Handling error locally and rethrowing it...', err);
        if (err.status === 403) {
          localStorage.setItem('token', '');
          this.authService.userLoggedIn$.next(false);
        }
        return throwError(err);
      })
    );
  }

  readExpr(expr: string): Observable<HaysonGrid> {
    const text = `ver:"3.0"
    expr
    "${expr}"`;

    return this.http.post(`${environment.skysparkServer}/eval`, text).pipe(
      catchError((err) => {
        console.log('Handling error locally and rethrowing it...', err);
        if (err.status === 403) {
          localStorage.setItem('token', '');
          this.authService.userLoggedIn$.next(false);
        }
        return throwError(err);
      })
    );
  }

  readExprAll(expr: string): Observable<HaysonGrid> {
    const text = `ver:"3.0"
    expr
    ${expr}`;

    return this.http.post(`${environment.skysparkServer}/eval`, text).pipe(
      catchError((err) => {
        if (err.status === 403) {
          localStorage.setItem('token', '');
          this.authService.userLoggedIn$.next(false);
        }
        return throwError(err);
      })
    );
  }

  generateExportRequest(viewName: string, state: any, filename: string) {
    const convertedState = btoa(state);
    const text = `ver:"3.0"
    view,state,filename,format
    "${viewName}","${convertedState}","${filename}.xls","excel"
    `;
    return this.http
      .post(`${environment.skysparkServer}/export`, text, {
        responseType: 'blob',
      })
      .pipe(
        take(1),
        tap((res: any) => {
          console.log(res);
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
          });

          var downloadURL = window.URL.createObjectURL(res);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = `${filename}.xls`;
          link.click();
        })
      )
      .subscribe();
  }

  ping(): void {
    interval(60 * 1000)
      .pipe(
        switchMap(() => this.authService.userLoggedIn$.asObservable()),
        filter((val) => val),
        switchMap(() => {
          return this.http.get(`${environment.skysparkServer}/about`);
        }),
        catchError((err) => of(err.status)),
        filter((err) => err === 403),
        tap(() => this.authService.userLoggedIn$.next(false))
      )
      .subscribe();
  }
}

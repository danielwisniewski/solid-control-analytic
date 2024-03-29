import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HaysonGrid, HGrid, HRef } from 'haystack-core';
import { interval, Observable, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestReadService {
  constructor(private http: HttpClient) {}

  readByFilter(filter: string): Observable<HaysonGrid> {
    const text = `ver:"3.0"
    filter
    "${filter}"`;

    return this.http.post(`${environment.skysparkServer}/read`, text);
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

    return this.http.post(`${environment.skysparkServer}/read`, text);
  }

  readExpr(expr: string): Observable<HaysonGrid> {
    const text = `ver:"3.0"
    expr
    "${expr}"`;

    return this.http.post(`${environment.skysparkServer}/eval`, text);
  }

  readExprAll(expr: string): Observable<HaysonGrid> {
    const text = `ver:"3.0"
    expr
    ${expr}`;

    return this.http.post(`${environment.skysparkServer}/eval`, text);
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
        switchMap(() => {
          return this.http.get(`${environment.skysparkServer}/about`);
        })
      )
      .subscribe();
  }

  about(): Observable<HaysonGrid> {
    return this.http.get(`${environment.skysparkServer}/about`);
  }
}

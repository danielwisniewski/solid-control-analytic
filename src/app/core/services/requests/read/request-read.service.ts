import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HaysonGrid, HGrid, HRef } from 'haystack-core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestReadService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  readByFilter(filter: string): Observable<HaysonGrid> {
    const text = `ver:"3.0"
    filter
    "${filter}"`;

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
        console.log('Handling error locally and rethrowing it...', err);
        if (err.status === 403) {
          localStorage.setItem('token', '');
          this.authService.userLoggedIn$.next(false);
        }
        return throwError(err);
      })
    );
  }
}

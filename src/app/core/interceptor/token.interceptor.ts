import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth-service.service';
import { ToastrPopupService } from 'src/app/core/services/toastr-popup.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastrPopup: ToastrPopupService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const version: number = parseFloat(
      localStorage.getItem('version') ?? '3.0'
    );
    const haystackMime: number = version >= 3.1 ? 4 : 3;
    if (token) {
      const isExport = request.url.includes('/skyspark/export');
      request = request.clone({
        setHeaders: {
          Authorization: `${token}`,
          Accept: !isExport
            ? `application/vnd.haystack+json;version=${haystackMime}`
            : '*/*',
          'Content-Type': 'text/zinc; charset=utf-8',
        },
      });
    }
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            if (event.status == 401) {
              alert('Unauthorized access!');
            }
          }
          return event;
        },
        error: (error) => {
          if (error.status === 403) {
            this.authService.userLoggedIn$.next(false);
          } else {
            this.toastrPopup.displayErrorMessage(
              error.message,
              'Nie udało się pobrać danych'
            );
          }
        },
      })
    );
  }
}

// application/vnd.haystack+json;version=3

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HAYSON_MIME_TYPE } from 'haystack-core';
import { AuthService } from '../auth/auth-service.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const isExport = request.url.includes('/skyspark/export');
      request = request.clone({
        setHeaders: {
          Authorization: `${token}`,
          Accept: !isExport ? 'application/vnd.haystack+json;version=4' : '*/*',
          'Content-Type': 'text/zinc; charset=utf-8',
        },
      });
    }
    return next.handle(request);
  }
}

// application/vnd.haystack+json;version=3

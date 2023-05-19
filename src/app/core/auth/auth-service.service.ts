import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, map, skip, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppStore } from '../store/app.store.';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn$ = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private router: Router,
    private AppStore: AppStore
  ) {
    this.userLoggedIn$
      .pipe(
        skip(1),
        tap((status: boolean) => {
          if (!status) {
            localStorage.clear();
            this.router.navigate(['login']);
          } else {
            this.AppStore.fetchAppConfig();
          }
        })
      )
      .subscribe();
  }

  login(username: string, password: string) {
    const loginData = btoa(
      JSON.stringify({
        name: username,
        password: password,
      })
    );
    return this.http
      .get<any>(
        `${environment.skysparkUrl}/auth/generateToken?username=${loginData}`
      )
      .pipe(
        take(1),
        map((res) => {
          if (typeof res !== 'string') {
            const token = res.data.Authorization;
            localStorage.setItem('token', token);
            this.userLoggedIn$.next(true);
            this.router.navigate(['']);
          }
          return res;
        })
      );
  }

  logout() {
    return this.http
      .get(`${environment.skysparkServer}/user/logout`)
      .pipe(
        take(1),
        map(() => {
          this.userLoggedIn$.next(false);
        })
      )
      .subscribe();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, map, skip, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppStore } from '../store/app.store.';
import { HGrid } from 'haystack-core';
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
            const route = environment.autologinEnabled ? 'autologin' : 'login';
            this.router.navigate([route]);
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

  onAutologin(username: string, password: string) {
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
      )
      .subscribe();
  }

  logout() {
    const grid = new HGrid().toZinc();
    return this.http
      .post(`${environment.skysparkServer}/close`, grid)
      .pipe(
        take(1),
        map(() => {
          this.userLoggedIn$.next(false);
        })
      )
      .subscribe();
  }
}

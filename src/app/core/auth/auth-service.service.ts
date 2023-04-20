import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, map, skip, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    const loginData = btoa(
      JSON.stringify({
        name: username,
        password: password,
      })
    );
    return this.http
      .get<any>(
        `http://localhost:3000/auth/generateToken?username=${loginData}`
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
      .get(`${environment.skysparkServer}/close`)
      .pipe(
        map(() => {
          this.userLoggedIn$.next(false);
        })
      )
      .subscribe();
  }

  userStatusChange: Subscription = this.userLoggedIn$
    .pipe(
      skip(1),
      tap((status: boolean) => {
        if (!status) {
          localStorage.removeItem('token');
          this.router.navigate(['login']);
        }
      })
    )
    .subscribe();
}

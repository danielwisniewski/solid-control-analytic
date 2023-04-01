import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    this.http
      .get<any>(
        `http://localhost:3000/auth/generateToken?username=${username}&password=${password}`
      )
      .pipe(
        map((res) => {
          const token = res.data.Authorization;
          localStorage.setItem('token', token);
          this.userLoggedIn$.next(true);
          this.router.navigate(['']);
        })
      )
      .subscribe();
  }

  logout() {
    return this.http
      .get(`${environment.skysparkServer}/close`)
      .pipe(
        map(() => {
          localStorage.removeItem('token');
          this.userLoggedIn$.next(false);
          this.router.navigate(['login']);
        })
      )
      .subscribe();
  }
}

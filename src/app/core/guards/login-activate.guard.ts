import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class LoginActivateGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token');
    if (!!token) {
      if (!this.authService.userLoggedIn$.getValue()) {
        this.authService.userLoggedIn$.next(true);
      }
      return true;
    } else {
      this.authService.userLoggedIn$.next(false);
      return false;
    }
  }
}

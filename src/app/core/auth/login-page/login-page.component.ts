import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { AuthService } from '../auth-service.service';
import { NgForm } from '@angular/forms';
import { catchError, take, tap } from 'rxjs';

export interface User {
  login: string;
  password: string;
}

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  focus: any;
  focus1: any;

  user: User = { login: '', password: '' };
  loginError: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.document.body.classList.add('login-page');
  }

  onSubmit(form: NgForm) {
    const user: User = form.value;
    this.authService
      .login(user.login, user.password)
      .pipe(
        catchError((err: any) => {
          this.loginError = err.error.message;
          return err.error.message;
        })
      )
      .subscribe();

    form.reset();
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('login-page');
  }
}

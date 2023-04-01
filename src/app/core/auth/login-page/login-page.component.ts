import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { AuthService } from '../auth-service.service';

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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.document.body.classList.add('login-page');

  }

  onSubmit(user: User) {
    console.log(user)
    this.authService.login(user.login, user.password)
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('login-page');
  }
}

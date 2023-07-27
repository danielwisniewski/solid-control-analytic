import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auto-login',
  templateUrl: './auto-login.component.html',
  styleUrls: ['./auto-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoLoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (!!environment.autologinEnabled)
      this.authService.onAutologin(
        environment.autologinUser.username,
        environment.autologinUser.password
      );
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { AuthService } from '../../auth/auth-service.service';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { selectActivePage } from '../../store/pages/pages.selectors';
import { Observable, filter, map, tap, withLatestFrom } from 'rxjs';
import { selectRoutes } from '../../store/menu/route.selectors';
import { selectActiveUsername } from '../../store/user/user.selector';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  sidebarMiniActive: boolean = true;
  isCollapsed: boolean = true;
  isAutologin: boolean = environment.autologinEnabled;
  private toggleButton!: HTMLElement;

  constructor(
    private element: ElementRef,
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  currentPathTitle$ = this.store.select(selectActivePage).pipe(
    withLatestFrom(this.store.select(selectRoutes)),
    map(([res, routes]) =>
      routes.find((route) => {
        const path = route.path.split('dashboard/')[1];
        if (!!path) return path === res?.path;
        else return false;
      })
    ),
    filter((res) => !!res),
    map((route) => route?.title)
  );

  username$: Observable<string> = this.store.select(selectActiveUsername).pipe(
    map((res) => {
      const usernameArr = res.split(' ');
      if (usernameArr.length < 2) return usernameArr[0][0];
      else return usernameArr[0][0] + usernameArr[1][0];
    })
  );

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.toggleButton = (<HTMLElement>this.element.nativeElement).querySelector(
      '.navbar-toggler'
    )!;
  }

  updateColor(): void {
    const navbar = document.getElementsByClassName('navbar')[0];
    if (window.innerWidth < 993 && !this.isCollapsed) {
      navbar.classList.add('bg-white');
      navbar.classList.remove('navbar-transparent');
    } else {
      navbar.classList.remove('bg-white');
      navbar.classList.add('navbar-transparent');
    }
  }

  minimizeSidebar(): void {
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('sidebar-mini')) {
      this.sidebarMiniActive = true;
    } else {
      this.sidebarMiniActive = false;
    }
    if (this.sidebarMiniActive === true) {
      body.classList.remove('sidebar-mini');
      this.sidebarMiniActive = false;
    } else {
      body.classList.add('sidebar-mini');
      this.sidebarMiniActive = true;
    }
  }

  sidebarOpen(): void {
    if (!this.toggleButton.classList.contains('toggled'))
      this.toggleButton.classList.remove('toggled');
  }

  sidebarClose(): void {
    if (this.toggleButton.classList.contains('toggled'))
      this.toggleButton.classList.remove('toggled');
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.updateColor();
  }
}

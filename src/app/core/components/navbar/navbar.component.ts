import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Router, RouterEvent, Event, ResolveEnd } from '@angular/router';
import { HDict } from 'haystack-core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { SiteStoreService } from 'src/app/core/store/site-store.service';
import { AuthService } from '../../auth/auth-service.service';
import { RouteInfo, sidebarRoutes } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  sidebarMiniActive: boolean = true;
  isCollapsed: boolean = true;

  locationTitle$ = new BehaviorSubject<string>('Dashboard 2');

  private toggleButton!: HTMLElement;

  private routerSub$: Subscription = new Subscription();

  private listTitles: RouteInfo[] = sidebarRoutes.filter(
    (listTitle) => listTitle
  );
  private currentPath: string = '/dashboard';

  constructor(
    private router: Router,
    private element: ElementRef,
    private ngZone: NgZone,

    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.routerSub$ = this.router.events
      .pipe(filter((e: Event): e is RouterEvent => e instanceof ResolveEnd))
      .subscribe((e: RouterEvent) => {
        this.currentPath = e.url;
        this.sidebarClose();
        this.ngZone.run(() => {
          this.locationTitle$.next(this.updateTitle());
        });
      });
  }

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

  updateTitle(): string {
    let activeRoute: RouteInfo[] = this.listTitles.filter(
      (listTitle: RouteInfo) => {
        return this.currentPath.split('/')[1] === listTitle.path.split('/')[1];
      }
    );
    return activeRoute[0].title;
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.routerSub$.unsubscribe();
    this.updateColor();
  }
}

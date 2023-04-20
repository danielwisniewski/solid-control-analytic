import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
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

  private toggleButton!: HTMLElement;

  private listTitles: RouteInfo[] = sidebarRoutes.filter(
    (listTitle) => listTitle
  );
  private routerEventsSubscription: Subscription;
  private currentPath: string = this.router.routerState.snapshot.url;

  title: string = '';

  constructor(
    private element: ElementRef,
    private router: Router,
    private authService: AuthService
  ) {
    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.urlAfterRedirects;
        this.updateTitle();
      }
    });
  }

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

  updateTitle(): string {
    let activeRoute: RouteInfo[] = this.listTitles.filter(
      (listTitle: RouteInfo) => {
        const index = this.currentPath.split('/').length;
        return (
          this.currentPath.split('/')[index - 1] ===
          listTitle.path.split('/')[index - 1]
        );
      }
    );
    this.title = activeRoute[0].title;
    return activeRoute[0].title;
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.updateColor();
    this.routerEventsSubscription.unsubscribe();
  }
}

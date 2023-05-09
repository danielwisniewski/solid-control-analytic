import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';

@Component({
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  // @HostListener('window:scroll', ['$event'])
  body: HTMLElement | undefined | null;
  mainPanel: HTMLElement | null = null;
  navbarMinimize: HTMLElement | null = null;

  sidebarMiniActive: boolean = true;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.body =
      (<HTMLElement>this.element.nativeElement).querySelector('body') ?? null;
    this.mainPanel = (<HTMLElement>this.element.nativeElement).querySelector(
      'main-panel'
    );
    this.navbarMinimize = (<HTMLElement>(
      this.element.nativeElement
    )).querySelector('navbar-minimize-fixed');
  }

  showNavbarButton(): void {
    if (
      document.documentElement.scrollTop > 50 ||
      (document.scrollingElement?.scrollTop ?? 0) > 50 ||
      (this.mainPanel?.scrollTop ?? 0) > 50
    ) {
      !!this.navbarMinimize?.style?.opacity
        ? (this.navbarMinimize.style.opacity = '1')
        : '';
    } else if (
      document.documentElement.scrollTop <= 50 ||
      (document.scrollingElement?.scrollTop ?? 0) <= 50 ||
      (this.mainPanel?.scrollTop ?? 0) <= 50
    ) {
      !!this.navbarMinimize?.style.opacity
        ? (this.navbarMinimize.style.opacity = '0')
        : '';
    }
  }

  minimizeSidebar(): void {
    if (this.body?.classList.contains('sidebar-mini')) {
      this.sidebarMiniActive = false;
      this.body?.classList.remove('sidebar-mini');
    } else {
      this.sidebarMiniActive = true;
      this.body?.classList.add('sidebar-mini');
    }
  }
}

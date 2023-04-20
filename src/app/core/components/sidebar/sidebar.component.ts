import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  smallTitle?: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  smallTitle?: string;
  title?: string;
  type?: string;
}

export const sidebarRoutes: RouteInfo[] = [
  {
    path: '/charts/halls',
    title: 'Hale',
    type: 'link',
    icontype: 'tim-icons icon-chart-bar-32',
  },
  {
    path: '/charts/production',
    title: 'Produkcja',
    type: 'link',
    icontype: 'tim-icons icon-chart-pie-36',
  },
  {
    path: '/charts/nonProduction',
    title: 'Dz. Nieprodukcyjne',
    type: 'link',
    icontype: 'tim-icons icon-chart-pie-36',
  },
  {
    path: '/charts/generalLoad',
    title: 'Cele ogólne',
    type: 'link',
    icontype: 'tim-icons icon-chart-pie-36',
  },
  {
    path: '/charts/indirectProduction',
    title: 'Kompresory',
    type: 'link',
    icontype: 'tim-icons icon-compass-05',
  },
  {
    path: '/charts/ventilation',
    title: 'Wentylacja',
    type: 'link',
    icontype: 'tim-icons icon-refresh-02',
  },
  {
    path: '/charts/gasStations',
    title: 'Stacje gazowe',
    type: 'link',
    icontype: 'tim-icons icon-sound-wave',
  },
  {
    path: '/reports',
    title: 'Raporty',
    type: 'link',
    icontype: 'tim-icons icon-notes',
  },
  {
    path: '/tmmp-config',
    title: 'Konfiguracja',
    type: 'link',
    icontype: 'tim-icons icon-settings-gear-63',
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  menuItems: RouteInfo[] = sidebarRoutes.filter((menuItem) => menuItem);
  constructor() {}

  ngOnInit(): void {}
}

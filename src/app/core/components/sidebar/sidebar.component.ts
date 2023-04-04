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
    path: '/dashboard',
    title: 'Dashboard',
    type: 'link',
    icontype: 'tim-icons icon-chart-pie-36',
  },
  {
    path: '/kpi',
    title: 'KPI',
    type: 'link',
    icontype: 'tim-icons icon-molecule-40',
  },
  {
    path: '/targets',
    title: 'Cele roczne',
    type: 'link',
    icontype: 'tim-icons icon-pin',
  },
  {
    path: '/utilityMeters',
    title: 'Raporty',
    type: 'link',
    icontype: 'tim-icons icon-components',
  },
  {
    path: '/pages',
    title: 'Liczniki mediów',
    type: 'sub',
    icontype: 'tim-icons icon-chart-bar-32',
    collapse: 'pages',
    isCollapsed: true,
    children: [
      {
        path: 'meters',
        title: 'Energia elektryczna',
        type: 'link',
        smallTitle: 'EN',
      },
      {
        path: 'utilityMeters',
        title: 'Energia cieplna',
        type: 'link',
        smallTitle: 'EC',
      },
      {
        path: 'waterMeters',
        title: 'Woda',
        type: 'link',
        smallTitle: 'W',
      },
    ],
  },
  {
    path: '/alerts',
    title: 'Alerty',
    type: 'link',
    icontype: 'tim-icons icon-bell-55',
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

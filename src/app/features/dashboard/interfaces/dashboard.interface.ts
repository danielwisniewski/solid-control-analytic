import { HDict, HGrid, HaysonGrid } from 'haystack-core';
import { RouteInfo } from 'src/app/core/components/sidebar/sidebar.component';

export interface DashboardState {
  title: string | undefined;
  timerange: string;
  skysparkFunc: string | undefined;
  site: HDict | undefined;
  layout:
    | {
        colNumber: number;
        rowHeight: number;
        tiles: Tile[];
      }
    | undefined;
  datepicker?: {
    type: 'range' | 'single';
    parameters: any;
  };
}

export interface AppConfig {
  menu: RouteInfo[];
  dashboards?: {
    path: string;
    title: string;
    skysparkFunc: string;
    layout: {
      colNumber: number;
      rowHeight: number;
      tiles: Tile[];
    };
    datepicker?: {
      type: 'range' | 'single';
      parameters: any;
    };
    variables?: DashboardVariable[];
  }[];
}

export interface Tile {
  cols: number;
  rows: number;
  tile: number;
  type: 'chart' | 'table';
  hasRollupSelector?: boolean;
  rollups?: Rollup[];
}

export interface Rollup {
  display: string;
  value: string;
}

export interface DashboardVariable {
  title: string;
  type: 'dropdown';
  selection: 'single' | 'multi';
  icon: string;
  options: HaysonGrid;
}

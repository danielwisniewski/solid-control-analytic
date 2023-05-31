import { Panel } from './panel.interface';

export interface PageState {
  scId: string;
  path: string;
  title: string;
  skysparkFunc: string;
  showSiteSelector: boolean;
  showTimerangeSelector: boolean;
  layout: {
    colNumber: number;
    rowHeight: number;
    tiles: Panel[];
  };
  datepicker?: {
    type: 'range' | 'single';
    parameters: any;
  };
  variables?: PageVariable[];
  parameters?: {
    [key: string]: any;
  };
  activeVariables?: {
    name: string;
    dis: string;
    val: any;
  }[];
}

export interface PageVariable {
  name: string;
  title?: string;
  type?: 'values' | 'query';
  skipUpdateOnSiteChange?: boolean;
  selection?: 'single' | 'multi';
  icon?: string;
  options?: any;
}

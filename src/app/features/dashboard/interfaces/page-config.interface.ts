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
  activeVariable?: PageVariable | undefined;
}

export interface PageVariable {
  name: string;
  title?: string;
  type?: 'values' | 'query';
  selection?: 'single' | 'multi';
  icon?: string;
  options?: any;
}

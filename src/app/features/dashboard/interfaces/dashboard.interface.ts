export interface PageConfig {
  scId: string;
  path: string;
  title: string;
  skysparkFunc: string;
  layout: {
    colNumber: number;
    rowHeight: number;
    tiles: Tile[];
  };
  showSiteSelector: boolean;
  showTimerangeSelector: boolean;
  datepicker?: {
    type: 'range' | 'single';
    parameters: any;
  };
  variables?: PageVariable[];
}

export interface Tile {
  cols: number;
  rows: number;
  tile: number;
  type: 'chart' | 'table';
  hasRollupSelector?: boolean;
  rollups?: Rollup[];
  meta?: PageTileMeta;
  columnsMeta?: TableColumnMeta[];
}

export interface Rollup {
  display: string;
  value: string;
}

export interface PageVariable {
  name: string;
  title?: string;
  type?: 'values' | 'query';
  selection?: 'single' | 'multi';
  icon?: string;
  options?: any;
}

export interface PageTileMeta extends ChartMeta, TableMeta {
  title?: string;
  showTitle?: boolean;
  subtitle?: string;
  showSubtitle?: boolean;
  showTileTypeSelector?: boolean;
  noDataTitle?: string;
  noDataSubtitle?: string;
  hasDownloadButton?: boolean;
  pivotAllowed?: boolean;
  customLabelTextActive?: boolean;
  customLabelText?: 'equipRef' | 'siteRef';
  skipUpdateOnVariableChange?: boolean;
  skipUpdateOnSiteChange?: boolean;
  skipUpdateOnTimerangeChange?: boolean;
}

interface TableMeta {
  filterColumns?: boolean;
  treeFromRelation?: string;
  treeToRelation?: string;
  isDropdown?: boolean;
}

export interface TableColumnMeta {
  columnName: string;
  dis?: string;
  visible?: boolean;
  columnType?:
    | 'editString'
    | 'editNumber'
    | 'editBoolean'
    | 'deleteButton'
    | 'buttonAction'
    | undefined;
  filterHeader?: boolean;
  stepSize?: number;
  actionType?: 'override' | 'function' | 'details' | 'functionInput' | 'link';
  funcName?: string;
  link?: string;
  buttonType?: 'text' | 'icon';
  buttonColor?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
  buttonText?: string;
  buttonIcon?: string;
  functionInputParameters?: {
    id: string;
    text: string;
    type?: 'text' | 'number';
    help?: string;
  }[];
  [key: string]: any;
}

interface ChartMeta {
  chartType?: 'bar' | 'line' | 'pie' | 'ranking' | 'donut';
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'right' | 'left' | 'chartArea';
  borderWidth?: number;
  borderRadius?: number;
  spacing?: number;
  tooltipMode?: string;
  stacked?: boolean;
}

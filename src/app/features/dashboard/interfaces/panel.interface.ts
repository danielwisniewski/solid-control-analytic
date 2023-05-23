import { HGrid } from 'haystack-core';

export interface Panel {
  tile: number;
  cols: number;
  rows: number;
  type: 'chart' | 'table';
  panelData?: HGrid | undefined;
  meta?: PanelConfiguration;
  columnsMeta?: ColumnConfiguration[];
  hasRollupSelector?: boolean;
  availableRollupOptions?: RollupOption[];
  parameters?: {
    rollup?: RollupOption;
    [key: string]: any;
  };
}

export interface RollupOption {
  display: string;
  value: string;
}

export interface PanelConfiguration extends ChartMeta, TableMeta {
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

export interface ColumnConfiguration {
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

import { PageConfig } from 'src/app/features/dashboard/interfaces/dashboard.interface';
import { RouteInfo } from '../components/sidebar/sidebar.component';

export interface AppConfig {
  menu: RouteInfo[];
  dashboards?: PageConfig[];
}

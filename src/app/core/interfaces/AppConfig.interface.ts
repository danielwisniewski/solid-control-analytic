import { PageState } from 'src/app/features/dashboard/interfaces/page-config.interface';
import { RouteInfo } from '../components/sidebar/sidebar.component';

export interface AppConfig {
  menu: RouteInfo[];
  dashboards?: PageState[];
}

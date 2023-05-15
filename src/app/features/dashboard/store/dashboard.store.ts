import { Injectable } from '@angular/core';
import { AppStore } from 'src/app/core/store/app.store.';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  combineLatest,
  filter,
  map,
  tap,
} from 'rxjs';
import { PageConfig } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardStore {
  constructor() {}

  triggerFetchingDataForPanels(configuration: PageConfig | undefined) {
    if (!!configuration) {
      this.activePage$.next(configuration);
    } else this.activePage$.next(this.activePage$.getValue());
  }

  /**
   * * activePageConfig$ is changed by creator module. Another value is used to not send
   * * http request to backend each time we want to change only visualization.
   */
  activePageByCreatorModule$ = new BehaviorSubject<PageConfig | undefined>(
    undefined
  );

  /**
   * * activePage$ is changed by router. It means that all panels show fetch data from backend.
   */
  activePage$ = new BehaviorSubject<PageConfig | undefined>(undefined);

  updatePageVariables(variables: any) {
    this.pageVariables = { ...variables };
    this.pageVariables$.next({ ...variables });
  }

  pageVariables$ = new ReplaySubject<any>(1);

  detailsPageId$ = new BehaviorSubject<string | undefined>(undefined);

  triggerDataUpdate$ = new BehaviorSubject<boolean | undefined>(undefined);

  pageVariables: any = {};

  activeTile$ = new BehaviorSubject<number>(0);
}

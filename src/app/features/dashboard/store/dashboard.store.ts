import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { PageState } from '../interfaces/page-config.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardStore {
  constructor() {}

  triggerFetchingDataForPanels(configuration: PageState | undefined) {
    if (!!configuration) {
      this.activePage$.next(configuration);
    } else this.activePage$.next(this.activePage$.getValue());
  }

  /**
   * * activePageConfig$ is changed by creator module. Another value is used to not send
   * * http request to backend each time we want to change only visualization.
   */
  activePageByCreatorModule$ = new BehaviorSubject<PageState | undefined>(
    undefined
  );

  /**
   * * activePage$ is changed by router. It means that all panels show fetch data from backend.
   */
  activePage$ = new BehaviorSubject<PageState | undefined>(undefined);

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

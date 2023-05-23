import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { PageVariable } from '../../../interfaces/page-config.interface';
import { HDict } from 'haystack-core';
import { DashboardStore } from '../../../store/dashboard.store';
import { DashboardService } from '../../../services/dashboard.service';
import {
  Subscription,
  auditTime,
  combineLatest,
  distinctUntilKeyChanged,
  map,
  merge,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { SiteStore } from 'src/app/core/store/site.store';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';

@Component({
  selector: 'app-dashboard-variable-dropdown',
  templateUrl: './dashboard-variable-dropdown.component.html',
  styleUrls: ['./dashboard-variable-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardVariableDropdownComponent implements OnInit {
  @Input() variable: PageVariable | undefined;
  data: HDict[] | undefined;
  activeOption: { dis: string; val: string } | undefined;
  constructor(
    private storeOld: DashboardStore,
    private pageService: DashboardService,
    private siteStore: SiteStore,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>
  ) {}
  sub: Subscription | undefined;
  options: { dis: string; val: any }[] | undefined;
  ngOnInit(): void {
    if (this.variable?.type === 'query') {
      this.sub = merge(this.siteStore.activeSite$)
        .pipe(
          auditTime(150),
          switchMap(() => {
            return this.pageService.getData(0);
          }),
          map((res) => res?.getRows().toHayson()),
          tap((res) => {
            this.options = res as any;
            if (!!this.options) {
              this.activeOption = this.options[0];
              this.storeOld.updatePageVariables({
                [`var-${this.variable?.name}`]: this.activeOption?.val,
              });
            }
            this.cdr.detectChanges();
          }),
          shareReplay(1)
        )
        .subscribe();
    } else if (this.variable?.type === 'values') {
      this.options = this.variable.options;
      this.activeOption = this.variable?.options[0];

      this.storeOld.updatePageVariables({
        [`var-${this.variable?.name}`]: this.activeOption?.val,
      });
    }
  }

  changeActiveOption(option: any) {
    this.activeOption = option;
    this.storeOld.updatePageVariables({
      [`var-${this.variable?.name}`]: this.activeOption?.val,
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}

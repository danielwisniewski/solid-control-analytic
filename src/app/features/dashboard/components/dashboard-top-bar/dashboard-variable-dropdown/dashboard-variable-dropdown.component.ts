import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import {
  PageState,
  PageVariable,
} from '../../../interfaces/page-config.interface';
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
import { selectPagePath } from 'src/app/core/store/router/router.reducer';
import { selectActivePage } from 'src/app/core/store/pages/pages.selectors';
import { Panel } from '../../../interfaces/panel.interface';
import {
  changeActivePanelIndex,
  changePanelParameters,
} from 'src/app/core/store/pages/panels.actions';

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
    if (this.variable?.type === 'values') this.valueTypeVariable();
    // if (this.variable?.type === 'query') {
    //   this.sub = merge(this.siteStore.activeSite$)
    //     .pipe(
    //       auditTime(150),
    //       switchMap(() => {
    //         return this.pageService.getData(0);
    //       }),
    //       map((res) => res?.getRows().toHayson()),
    //       tap((res) => {
    //         this.options = res as any;
    //         if (!!this.options) {
    //           this.activeOption = this.options[0];
    //           this.storeOld.updatePageVariables({
    //             [`var-${this.variable?.name}`]: this.activeOption?.val,
    //           });
    //         }
    //         this.cdr.detectChanges();
    //       }),
    //       shareReplay(1)
    //     )
    //     .subscribe();
    // } else if (this.variable?.type === 'values') {
    //   this.options = this.variable.options;
    //   this.activeOption = this.variable?.options[0];

    //   this.storeOld.updatePageVariables({
    //     [`var-${this.variable?.name}`]: this.activeOption?.val,
    //   });
    // }
  }

  private activePage: PageState | undefined;
  private tilesToUpdate: Panel[] | undefined = [];
  private pageSub = this.store
    .select(selectActivePage)
    .pipe(
      tap((page) => {
        this.activePage = page;
        this.tilesToUpdate = this.activePage?.layout.tiles.filter(
          (tile) => !tile.meta?.skipUpdateOnVariableChange
        );
        this.updateData();
      })
    )
    .subscribe();

  private updateData() {}

  private valueTypeVariable() {
    if (!!this.variable && !!this.tilesToUpdate) {
      this.options = this.variable.options;
      const defaultParameter = this.variable.options[0];
      this.tilesToUpdate.forEach((tile) => {
        const panelVariable = tile.parameters?.[`var-${this.variable!.name}`];
        const varToSend = !!panelVariable ? panelVariable : defaultParameter;
        this.activeOption = varToSend;
        this.store.dispatch(changeActivePanelIndex({ id: tile.tile ?? -1 }));
        this.store.dispatch(
          changePanelParameters({
            parameter: `var-${this.variable!.name}`,
            value: varToSend.val,
          })
        );
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
    this.pageSub.unsubscribe();
  }
}

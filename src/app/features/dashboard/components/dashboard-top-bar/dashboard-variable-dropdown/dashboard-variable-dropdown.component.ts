import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { PageVariable } from '../../../interfaces/page-config.interface';
import { Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import { changePageVariable } from 'src/app/core/store/pages/pages.actions';
import { DashboardService } from '../../../services/dashboard.service';
import { selectActiveSite } from 'src/app/core/store/sites/site.selectors';
import { HRef } from 'haystack-core';

@Component({
  selector: 'app-dashboard-variable-dropdown',
  templateUrl: './dashboard-variable-dropdown.component.html',
  styleUrls: ['./dashboard-variable-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardVariableDropdownComponent implements OnInit {
  @Input() variable: PageVariable | undefined;

  constructor(
    private store: Store<AppState>,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  activeOption: { dis: string; val: string; name: string } | undefined;

  sub: Subscription = this.store.select(selectActiveSite).subscribe(() => {
    if (
      !this.variable?.skipUpdateOnSiteChange &&
      this.variable?.type === 'query'
    )
      this.fetchVariables();
  });

  options: { dis: string; val: any }[] | undefined;

  ngOnInit(): void {
    if (!this.variable) return;
    if (this.variable.type === 'values') {
      this.options = this.variable.options;

      const defaultParameter = this.variable.options[0];
      this.changeActiveOption(defaultParameter);
    }
    if (this.variable.type === 'query') {
      this.fetchVariables();
    }
  }

  private fetchVariables() {
    this.dashboardService
      .fetchParametersOptions()
      .pipe(take(1))
      .subscribe((res) => {
        this.options = res as any;
        if (!!this.options && !!this.variable && this.options.length > 0) {
          this.changeActiveOption(this.options[0]);
          this.activeOption = {
            name: this.variable?.name,
            val: this.options[0].val,
            dis: this.options[0].dis,
          };
          this.cdr.detectChanges();
        }
      });
  }

  changeActiveOption(option: any) {
    this.activeOption = option;
    this.store.dispatch(
      changePageVariable({
        name: this.variable!.name,
        dis: option.dis,
        val: option.val,
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { PageVariable } from '../../../interfaces/dashboard.interface';
import { HDict, HGrid, HaysonGrid } from 'haystack-core';
import { DashboardStore } from '../../../store/dashboard.store';
import { DashboardService } from '../../../services/dashboard.service';
import { Subscription, map, tap } from 'rxjs';

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
    private store: DashboardStore,
    private pageService: DashboardService
  ) {}
  sub: Subscription | undefined;
  options: { dis: string; val: any }[] | undefined;
  ngOnInit(): void {
    if (this.variable?.type === 'query') {
      this.sub = this.pageService
        .getData(0)
        .pipe(
          map((res) => res?.getRows().toHayson()),
          tap((res) => {
            this.options = res as any;
          })
        )
        .subscribe();
    } else if (this.variable?.type === 'values') {
      this.options = this.variable.options;
      this.activeOption = this.variable?.options[0];
    }
  }

  changeActiveOption(option: any) {
    this.activeOption = option;
    this.store.pageVariables$.next({
      [`var-${this.variable?.name}`]: this.activeOption?.val,
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}

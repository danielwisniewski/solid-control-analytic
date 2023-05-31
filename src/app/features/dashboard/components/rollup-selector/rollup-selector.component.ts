import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { Panel, RollupOption } from '../../interfaces/panel.interface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state';
import {
  changeActivePanelIndex,
  changePanelParameters,
} from 'src/app/core/store/pages/panels.actions';
import { selectPagePath } from 'src/app/core/store/router/router.reducer';
import { tap } from 'rxjs';

@Component({
  selector: 'app-rollup-selector',
  templateUrl: './rollup-selector.component.html',
  styleUrls: ['./rollup-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RollupSelectorComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  @Input() tile: Panel | undefined;

  activeRollup: RollupOption = {
    display: 'D',
    value: '1day',
  };

  private pageSub = this.store
    .select(selectPagePath)
    .pipe(tap(() => this.updateData()))
    .subscribe();

  ngOnInit(): void {
    this.updateData();
  }

  private updateData() {
    console.log(this.tile);
    if (!this.tile?.tile) return;
    this.store.dispatch(changeActivePanelIndex({ id: this.tile?.tile ?? -1 }));
    this.store.dispatch(
      changePanelParameters({ parameter: 'rollup', value: this.activeRollup })
    );
  }

  onRollupChangeFunc(rollup: RollupOption | undefined) {
    if (!!rollup && !!this.tile) {
      this.activeRollup = rollup;
      this.updateData();
    }
  }

  trackBy(index: number, item: RollupOption) {
    return item.display;
  }

  ngOnDestroy() {
    this.pageSub.unsubscribe();
  }
}

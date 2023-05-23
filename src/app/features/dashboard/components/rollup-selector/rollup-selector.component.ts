import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

import { DashboardService } from '../../services/dashboard.service';
import { Panel, RollupOption } from '../../interfaces/panel.interface';

@Component({
  selector: 'app-rollup-selector',
  templateUrl: './rollup-selector.component.html',
  styleUrls: ['./rollup-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RollupSelectorComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}

  @Input() tile: Panel | undefined;
  @Output() onRollupChange = new EventEmitter<any>();

  activeRollup: RollupOption = {
    display: 'D',
    value: '1day',
  };

  ngOnInit(): void {
    this.onRollupChange.emit(this.activeRollup);
  }

  onRollupChangeFunc(rollup: RollupOption | undefined) {
    if (!!rollup) {
      this.activeRollup = rollup;
      this.onRollupChange.emit(this.activeRollup);
    }
  }

  trackBy(index: number, item: RollupOption) {
    return item.display;
  }
}

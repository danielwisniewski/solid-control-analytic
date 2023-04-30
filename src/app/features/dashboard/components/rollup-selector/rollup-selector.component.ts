import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { Rollup, Tile } from '../../interfaces/dashboard.interface';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-rollup-selector',
  templateUrl: './rollup-selector.component.html',
  styleUrls: ['./rollup-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RollupSelectorComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}

  @Input() tile: Tile | undefined;
  @Output() onRollupChange = new EventEmitter<any>();

  activeRollup: Rollup = {
    display: 'D',
    value: '1day',
  };

  ngOnInit(): void {
    this.onRollupChange.emit(this.activeRollup);
  }

  onRollupChangeFunc(rollup: Rollup | undefined) {
    if (!!rollup) {
      this.activeRollup = rollup;
      this.onRollupChange.emit(this.activeRollup);
    }
  }

  trackBy(index: number, item: Rollup) {
    return item.display;
  }
}

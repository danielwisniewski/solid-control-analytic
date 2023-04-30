import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'app-chart-table-toggle',
  templateUrl: './chart-table-toggle.component.html',
  styleUrls: ['./chart-table-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTableToggleComponent implements OnInit {
  @Input() tileType: 'chart' | 'table' = 'chart';
  @Output() tileTypeToggled = new EventEmitter<'chart' | 'table'>();
  @HostBinding('class') classes = 'radio_switch ml-1';
  constructor() {}

  ngOnInit(): void {}

  onTypeChange(type: 'chart' | 'table') {
    this.tileTypeToggled.emit(type);
  }
}

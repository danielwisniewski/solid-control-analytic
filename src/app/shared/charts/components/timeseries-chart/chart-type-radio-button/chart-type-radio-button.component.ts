import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-chart-type-radio-button',
  templateUrl: './chart-type-radio-button.component.html',
  styleUrls: ['./chart-type-radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartTypeRadioButtonComponent implements OnInit {
  constructor() {}

  @Output() optionChanged = new EventEmitter<'time' | 'ranking'>();

  activeOption: 'time' | 'ranking' = 'time';

  optionTypeChanged(type: 'time' | 'ranking') {
    this.activeOption = type;
    this.optionChanged.emit(type);
  }

  ngOnInit(): void {}
}

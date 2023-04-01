import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-data-type-radio-button',
  templateUrl: './data-type-radio-button.component.html',
  styleUrls: ['./data-type-radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTypeRadioButtonComponent implements OnInit {
  constructor() {}

  @Output() optionChanged = new EventEmitter<'cost' | 'usage'>();

  activeOption: 'cost' | 'usage' = 'usage';

  optionTypeChanged(type: 'cost' | 'usage'): void {
    this.activeOption = type;
    this.optionChanged.emit(type);
  }

  ngOnInit(): void {}
}

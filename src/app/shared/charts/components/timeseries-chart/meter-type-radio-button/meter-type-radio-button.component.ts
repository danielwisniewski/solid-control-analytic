import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { METER_TYPE } from 'src/app/core/constants/meters.const';
import { MeterType, MeterTypes } from 'src/app/shared/interfaces/meter-type';

@Component({
  selector: 'app-meter-type-radio-button',
  templateUrl: './meter-type-radio-button.component.html',
  styleUrls: ['./meter-type-radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterTypeRadioButtonComponent implements OnInit {
  constructor() {}

  @Output() meterTypeChanged = new EventEmitter<MeterType>();

  activeOption: MeterType = METER_TYPE.elecMeter;
  meterTypes: MeterTypes = METER_TYPE;

  ngOnInit(): void {}

  optionChanged(option: MeterType) {
    this.activeOption = option;
    this.meterTypeChanged.emit(this.activeOption);
  }
}

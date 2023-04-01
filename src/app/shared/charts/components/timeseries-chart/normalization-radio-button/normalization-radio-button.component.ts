import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { NormalizationOptions } from '../../../enums/charts.enum';

@Component({
  selector: 'app-normalization-radio-button',
  templateUrl: './normalization-radio-button.component.html',
  styleUrls: ['./normalization-radio-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormalizationRadioButtonComponent {
  constructor() {}

  activeOption: number = 0;

  @Output() optionChanged = new EventEmitter<NormalizationOptions[]>();

  changeNormalizationOption(normalization: number): void {
    if (normalization === 0) {
      this.activeOption = 0;
      this.optionChanged.emit([]);
    } else if (normalization === 1) {
      this.activeOption = 1;
      this.optionChanged.emit([NormalizationOptions.energyNormByArea]);
    } else if (normalization === 2) {
      this.activeOption = 2;
      this.optionChanged.emit([NormalizationOptions.energyNormByDegreeDay]);
    }
  }
}

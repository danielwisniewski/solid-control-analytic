import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
} from '@angular/core';
import { HDict } from 'haystack-core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-core',
  templateUrl: './dropdown-core.component.html',
  styleUrls: ['./dropdown-core.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownCoreComponent implements OnInit {
  @Input() title: string = 'Wybierz budynek';
  @Input()
  activeOption: string | null = this.title;
  @Input()
  dropdownListOptions: HDict[] | null = null;
  @Input() icon: string = 'icon-square-pin';
  @Input() showPortfolioOption: boolean = false;

  @Output() optionChanged: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  changeActiveOption(option: any) {
    if (option === 'portfolio') {
      option = HDict.make({
        id: 'portfolio',
        dis: 'Portfolio',
      });
    }
    this.optionChanged.emit(option);
  }
}

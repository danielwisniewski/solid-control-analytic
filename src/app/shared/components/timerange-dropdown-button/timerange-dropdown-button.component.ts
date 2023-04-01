import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HDict } from 'haystack-core';
import { Observable } from 'rxjs';
import {
  TimerangeOption,
  TimerangeStoreService,
} from 'src/app/core/store/timerange-store.service';

@Component({
  selector: 'app-timerange-dropdown-button',
  templateUrl: './timerange-dropdown-button.component.html',
  styleUrls: ['./timerange-dropdown-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerangeDropdownButtonComponent implements OnInit {
  title: string = 'Wybierz zakres';
  timerangeList: HDict[] = [];
  activeTimerange$: Observable<TimerangeOption> =
    this.timerangeStore.activeTimerange$.asObservable();

  constructor(private timerangeStore: TimerangeStoreService) {}

  ngOnInit(): void {
    this.getTimerangeList();
  }

  private getTimerangeList(): void {
    this.timerangeStore.getTimerangeOptions().forEach((element: any) => {
      this.timerangeList.push(HDict.make(element));
    });
  }

  getActiveOption(): string {
    return this.timerangeStore.getActiveOption().dis;
  }

  timerangeChanged(timerange: HDict) {
    console.log(timerange);
    const tr: TimerangeOption = {
      dis: timerange.get('dis')!.toString(),
      value: timerange.get('value')!.toString(),
      rollup: timerange.get('rollup')!.toString(),
    };
    this.timerangeStore.setActiveOption(tr);
  }
}

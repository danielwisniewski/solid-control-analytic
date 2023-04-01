import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HDict } from 'haystack-core';
import { map, Observable } from 'rxjs';
import { MetersStoreService } from '../../store/meters-store.service';

@Component({
  selector: 'app-meter-type-dropdown-button',
  templateUrl: './meter-type-dropdown-button.component.html',
  styleUrls: ['./meter-type-dropdown-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterTypeDropdownButtonComponent implements OnInit {
  constructor(private metersStore: MetersStoreService) {}
  title: string = 'Wybierz typ licznika';
  meterTypes$: Observable<HDict[] | undefined> =
    this.metersStore.getMetersTypes();
  activeOption$: Observable<string | undefined> =
    this.metersStore.activeMeterType$
      .asObservable()
      .pipe(map((res) => res?.toDis()));

  ngOnInit(): void {}

  changeActiveOption(option: HDict): void {
    this.metersStore.activeMeterType$.next(option);
  }
}

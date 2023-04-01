import { Component, OnInit } from '@angular/core';
import { HRef } from 'haystack-core';
import { Observable } from 'rxjs';
import { METER_TYPE } from 'src/app/core/constants/meters.const';
import {
  TimerangeStoreService,
  TimerangeOption,
} from 'src/app/core/store/timerange-store.service';
import { MeterTypes } from 'src/app/shared/interfaces/meter-type';

@Component({
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.scss'],
})
export class PortfolioPageComponent implements OnInit {
  constructor(private timerangeStore: TimerangeStoreService) {}

  activeSiteId: HRef = HRef.make('nav:equip.all');

  meterTypes: MeterTypes = METER_TYPE;

  activeTimerange$: Observable<TimerangeOption> =
    this.timerangeStore.activeTimerange$.asObservable();

  ngOnInit(): void {}
}

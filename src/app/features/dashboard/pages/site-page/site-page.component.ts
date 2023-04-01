import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HDict, HRef } from 'haystack-core';
import { combineLatest, map, Observable } from 'rxjs';
import { METER_TYPE } from 'src/app/core/constants/meters.const';
import { EquipStoreService } from 'src/app/core/store/equip-store.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';
import {
  TimerangeOption,
  TimerangeStoreService,
} from 'src/app/core/store/timerange-store.service';
import { MeterTypes } from 'src/app/shared/interfaces/meter-type';
import { SitePageService } from '../../services/site-page.service';

@Component({
  selector: 'app-site-page',
  templateUrl: './site-page.component.html',
  styleUrls: ['./site-page.component.scss'],
})
export class SitePageComponent implements OnInit {
  constructor(
    private sitePageService: SitePageService,
    private siteStore: SiteStoreService,
    private timerangeStore: TimerangeStoreService,
    private equipStore: EquipStoreService
  ) {}

  meterTypes: MeterTypes = METER_TYPE;

  @ViewChild('grafana') grafana: ElementRef | undefined;

  ngOnInit(): void {
    this.timerangeStore.activeTimerange$.next(
      this.timerangeStore.getTimerangeOptions()[7]
    );
  }

  elecSiteMeter$: Observable<HDict | undefined> =
    this.equipStore.elecSiteMeter$;
  waterSiteMeter$: Observable<HDict | undefined> =
    this.equipStore.waterSiteMeter$;
  gasSiteMeter$: Observable<HDict | undefined> = this.equipStore.gasSiteMeter$;
  heatSiteMeter$: Observable<HDict | undefined> =
    this.equipStore.heatSiteMeter$;

  elecSiteMeterId$: Observable<HRef | undefined> = this.elecSiteMeter$.pipe(
    map((meter: HDict | undefined) => {
      return meter?.get<HRef>('id');
    })
  );
  activeSiteId$: Observable<HRef | undefined> = this.siteStore.activeSite$.pipe(
    map((site) => {
      if (!site || !site.has('id')) return undefined;
      else return site.get<HRef>('id');
    })
  );

  activeTimerange$: Observable<TimerangeOption> =
    this.timerangeStore.activeTimerange$;

  getClassName(): Observable<string> {
    return combineLatest([
      this.elecSiteMeter$,
      this.waterSiteMeter$,
      this.gasSiteMeter$,
      this.heatSiteMeter$,
    ]).pipe(
      map(([elecMeter, waterMeter, gasMeter, heatMeter]) => {
        let count = 0;
        if (elecMeter) count++;
        if (waterMeter) count++;
        if (gasMeter) count++;
        if (heatMeter) count++;

        if (count === 1) return 'col-12';
        else if (count === 2) return 'col-lg-6 col-sm-12';
        else if (count === 3) return 'col-lg-4 col-sm-12';
        else if (count === 4) return 'col-lg-3 col-sm-12';
        else return 'col-12';
      })
    );
  }

  onButton(val: string) {
    if (this.grafana) {
      const message = {
        type: 'updateVariable',
        data: {
          name: 'var-siteMeters',
          value: val,
        },
      };

      this.grafana.nativeElement.contentWindow?.postMessage(message, '*');

      var dateOffset = 24 * 60 * 60 * 1000 * 45; //5 days
      var myDate = new Date().setTime(new Date().getTime() - dateOffset);
      const endDate = new Date().setTime(
        new Date().getTime() - 24 * 60 * 60 * 1000 * 30
      );

      const timeSrv = this.grafana.nativeElement.contentWindow?.angular
        .element('grafana-app')
        .injector()
        .get('timeSrv');

      timeSrv.setTime({
        from: myDate,
        to: endDate,
      });
    }
  }

  doStyle(number: number, frame: HTMLIFrameElement) {
    const new_style_element = document.createElement('style');
    new_style_element.textContent = `
    
    .grafana-app, #reactRoot > div.grafana-app > main > div:nth-child(3) {
      background-color: #1e1e2f;
    }
    .panel-container, .page-toolbar {
      background-color: #27293d
    }
    .variable-link-wrapper > button {
      background: transparent !important;
      margin-top: 1rem;
    }

    .grafana-app {
      top: -40px;
      height: calc(100% + 40px)
    }

    .scrollbar-view > div {
      padding-left: 0px;
      padding-right: 0px
    }
    
    #reactRoot > div.grafana-app > main > div.css-j6bmzp > div > div > div.scrollbar-view > div > div > div:nth-child(1) > div > div > div[data-panelid="5"] {
      visibility: hidden;
    }
    #reactRoot
      > div.grafana-app
      > main
      > div.css-j6bmzp
      > header
      > nav
      > div.css-ogsqfw {
      visibility: hidden;
    }
    #reactRoot
      > div.grafana-app
      > main
      > div.css-j6bmzp
      > header
      > nav
      > div.css-63jktz
      > div:nth-child(2) {
      display: none;
    }
    #reactRoot > div.grafana-app > div > nav {
      display: none;
    }
    button[aria-label="Show more items"],
    button[aria-label="Cycle view mode"] {
      display: none;
    }`;
    if (this.grafana) {
      this.grafana.nativeElement.contentDocument?.head.appendChild(
        new_style_element
      );
    }
  }
}

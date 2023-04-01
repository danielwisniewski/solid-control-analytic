import { Component, OnInit } from '@angular/core';
import { GridColumn, HBool, HDict, HGrid, HRef } from 'haystack-core';
import { map, take } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { EquipStoreService } from 'src/app/core/store/equip-store.service';
import { SiteStoreService } from 'src/app/core/store/site-store.service';
import {
  Meter,
  MetersDataGeneratorService,
} from '../meters-data-generator.service';

@Component({
  selector: 'app-meters-list',
  templateUrl: './meters-list.component.html',
  styleUrls: ['./meters-list.component.scss'],
})
export class MetersListComponent implements OnInit {
  metersList: Meter[] = [];
  responseData!: HGrid<HDict>;
  tableColumns!: GridColumn[];
  activeSite: HDict = HDict.make();

  constructor(
    private mdg: MetersDataGeneratorService,
    private siteStore: SiteStoreService,
    private equipStore: EquipStoreService
  ) { }

  ngOnInit(): void {
    this.metersList = this.mdg.getMetersData();

    this.siteStore.activeSite$
      .pipe(
        map((site) => {
          this.activeSite = site!;
          this.getEquipData();
        })
      )
      .subscribe();
  }

  generateTableColumns(data: HGrid<HDict>): void {
    this.tableColumns = data
      .getColumns()
      .filter(
        (cl) =>
          cl.meta.has('visible') && (cl.meta.get('visible') as HBool).value
      );
  }

  getEquipData(): void {
    this.equipStore.equipData$
      .pipe(
        take(1),
        map((res) => {
          this.responseData = res.filter((row: HDict): boolean => {
            return (
              row.has('meter') &&
              row.get<HRef>('siteRef')!.equals(this.activeSite.get<HRef>('id'))
            );
          });
          this.generateTableColumns(this.responseData);
        })
      )
      .subscribe();
  }
}

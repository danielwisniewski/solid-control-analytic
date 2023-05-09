import { Injectable } from '@angular/core';
import { HDict, HStr } from 'haystack-core';
import { RouteInfo } from 'src/app/core/components/sidebar/sidebar.component';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';

@Injectable({
  providedIn: 'root',
})
export class MenuBuilderService {
  constructor(private readReq: RequestReadService) {}

  updateMenuConfig(element: RouteInfo[]) {
    const configObject = HDict.make({ menu: element.toHayson() });
    const query = `read(appConfig and menu).set("config", ${JSON.stringify(
      configObject
    )}).recEdit`;

    const zincQuery = HStr.make(query).toZinc();

    return this.readReq.readExprAll(zincQuery).subscribe();
  }
}

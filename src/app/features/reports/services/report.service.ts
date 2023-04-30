import { Injectable } from '@angular/core';
import { HGrid } from 'haystack-core';
import { Observable, map } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { queryToZinc } from '../../tmmp-config/utils/utils.functions';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private req: RequestReadService) {}

  generateReport(
    timerange: string,
    type: string,
    rollup: string
  ): Observable<HGrid> {
    const query = `${type}(${timerange}, ${rollup})`;

    return this.req
      .readExprAll(queryToZinc(query))
      .pipe(map((res) => HGrid.make(res)));
  }
}

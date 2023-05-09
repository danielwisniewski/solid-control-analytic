import { Injectable } from '@angular/core';
import { HDict, HGrid, HRef, HaysonDict, HaysonGrid } from 'haystack-core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  finalize,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';
import { queryToZinc } from '../utils/utils.functions';
import { ToastrPopupService } from '../../../core/services/toastr-popup.service';
import { SiteStore } from 'src/app/core/store/site.store';

@Injectable({
  providedIn: 'root',
})
export class MeterAssignmentService {
  constructor(
    private req: RequestReadService,
    private siteStore: SiteStore,
    private message: ToastrPopupService
  ) {}
  update$ = new BehaviorSubject<boolean>(false);
  getMeterData(id: string): Observable<HaysonDict | undefined> {
    const idRef = HRef.make(`@${id}`);
    return this.req.readById(idRef).pipe(
      filter((val: HaysonGrid) => {
        if (val.rows && val.rows.length) return true;
        else return false;
      }),
      map((val: HaysonGrid) => {
        if (val.rows) return val.rows[0];
        else return undefined;
      }),
      filter((val) => typeof val !== 'undefined')
    );
  }

  getAssignedMeters(id: string): Observable<HaysonGrid> {
    const idRef = `@${id}`;
    const query = `readAll(meter and costCenterMeterRef->id==${idRef})`;
    return this.update$.pipe(
      switchMap(() => {
        return this.req.readExprAll(queryToZinc(query));
      })
    );
  }

  getMetersList(id: string, type: string) {
    return this.siteStore.activeSite$.pipe(
      filter((site) => !!site && !!site.get('id')),
      map((site) => site?.get('id')?.toZinc(true)),
      switchMap((siteId) => {
        const query = `readAll(meter and ${type} and not costCenterMeter and not costCenterMainMeter)`;

        return this.req.readExprAll(queryToZinc(query));
      }),
      map((res: HaysonGrid) => {
        let grid = HGrid.make(res);
        grid = grid.filter((row: HDict) => {
          if (
            row.has('costCenterMeterRef') &&
            row.get<HRef>('costCenterMeterRef')?.value === id
          )
            return false;
          else return true;
        });
        return grid.toJSON();
      })
    );
  }

  assignMeter(mainMeterId: string, submeter: HDict) {
    const submeterId = submeter.get('id')?.toZinc(true);

    const query = `readById(${submeterId}).set("costCenterMeterRef", parseRef("${mainMeterId}")).recEdit`;

    this.req
      .readExprAll(queryToZinc(query))
      .pipe(
        take(1),
        tap((res: HaysonGrid) => {
          const grid = HGrid.make(res);
          if (grid.isEmpty())
            throw new Error(grid.meta.get('errTrace')?.toString());
        }),
        catchError((err) => {
          this.message.displayErrorMessage(
            `Nie udało się przypisać licznika. \n ${err.message}`
          );
          return err;
        }),
        finalize(() => {
          this.update$.next(true);
          this.siteStore.activeSite$.next(
            this.siteStore.activeSite$.getValue()
          );
        })
      )
      .subscribe((res: any) => {
        this.message.displaySuccessMessage(
          `Przypisano licznik do centrum kosztowego.`
        );
      });
  }

  deleteAssignment(submeter: HaysonDict) {
    const submeterId = HDict.make(submeter).get('id')?.toZinc(true);

    const query = `readById(${submeterId}).set("costCenterMeterRef", {-x} -> x).recEdit`;
    this.req
      .readExprAll(queryToZinc(query))
      .pipe(
        take(1),
        tap((res: HaysonGrid) => {
          const grid = HGrid.make(res);
          if (grid.isEmpty())
            throw new Error(grid.meta.get('errTrace')?.toString());
        }),
        catchError((err) => {
          this.message.displayErrorMessage(
            `Nie udało się usunąć przypisania licznika. \n ${err.message}`
          );
          return err;
        }),
        finalize(() => {
          this.update$.next(true);
          this.siteStore.activeSite$.next(
            this.siteStore.activeSite$.getValue()
          );
        })
      )
      .subscribe((res: any) => {
        this.message.displaySuccessMessage(`Usunięto przypisanie licznika.`);
      });
  }
}

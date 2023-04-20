import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  HDict,
  HGrid,
  HRef,
  HStr,
  HaysonDict,
  HaysonGrid,
} from 'haystack-core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  debounceTime,
  filter,
  fromEvent,
  map,
  pluck,
} from 'rxjs';
import { MeterAssignmentService } from '../../services/meter-assignment.service';

@Component({
  templateUrl: './meter-assignment.component.html',
  styleUrls: ['./meter-assignment.component.scss'],
})
export class MeterAssignmentComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private route: ActivatedRoute,
    private serv: MeterAssignmentService
  ) {}

  @ViewChild('navName')
  navNameInput: ElementRef | undefined;

  mainMeterId: string = this.route.snapshot.paramMap.get('id') || '';
  isGas: boolean = this.route.snapshot.url[0].path.includes('gas');
  meterData$: Observable<HDict | undefined> = this.serv
    .getMeterData(this.route.snapshot.paramMap.get('id') || '')
    .pipe(
      map((val) => {
        const value = HDict.make(val);
        return value;
      })
    );

  assignedMeters$: Observable<HaysonGrid> = this.serv.getAssignedMeters(
    this.mainMeterId
  );
  nameFilter$ = new BehaviorSubject<string>('');

  availableMeters$: Observable<HGrid> = combineLatest([
    this.serv.getMetersList(this.mainMeterId, this.isGas ? 'gas' : 'elec'),
    this.nameFilter$,
  ]).pipe(
    map(([res, filter]) => {
      if (filter === '' || filter.length == 1) return HGrid.make(res);
      else {
        let grid = HGrid.make(res);
        return grid.filter((row: HDict): boolean => {
          return row
            .toDis()
            .toString()
            .toLowerCase()
            .includes(filter.toLowerCase());
        });
      }
    })
  );

  ngOnInit(): void {}
  sub: Subscription | undefined;
  ngAfterViewInit(): void {
    this.sub = fromEvent(this.navNameInput?.nativeElement, 'keyup')
      .pipe(
        pluck('target', 'value'),
        filter((res: any) => res.length > 0),
        debounceTime(500)
      )
      .subscribe((res) => this.nameFilter$.next(res));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onAssignButton(row: HDict) {
    this.serv.assignMeter(this.mainMeterId, row);
  }

  onDeleteAssingment(row: HaysonDict) {
    this.serv.deleteAssignment(row);
  }

  getMeterName(row: HDict) {
    if (row.has('costCenterMeterRef'))
      return row.get<HRef>('costCenterMeterRef')?.dis;
    else return;
  }
}

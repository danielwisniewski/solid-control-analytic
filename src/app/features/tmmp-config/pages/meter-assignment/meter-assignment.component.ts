import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HDict, HGrid, HStr, HaysonDict, HaysonGrid } from 'haystack-core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  of,
  pluck,
  switchMap,
  tap,
  withLatestFrom,
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
  meterData$: Observable<string | undefined> = this.serv
    .getMeterData(this.route.snapshot.paramMap.get('id') || '')
    .pipe(
      map((val) => {
        if (val && val.hasOwnProperty('navName'))
          return val['navName'] as string;
        else return undefined;
      })
    );

  assignedMeters$: Observable<HaysonGrid> = this.serv.getAssignedMeters(
    this.mainMeterId
  );
  nameFilter$ = new BehaviorSubject<string>('');

  availableMeters$: Observable<HaysonGrid> = combineLatest([
    this.serv.getMetersList(),
    this.nameFilter$,
  ]).pipe(
    map(([res, filter]) => {
      console.log(filter === '' || filter.length == 1);
      if (filter === '' || filter.length == 1) return res;
      else {
        let grid = HGrid.make(res);
        grid = grid.filter((row: HDict): boolean => {
          if (row.has('navName'))
            return row.get<HStr>('navName')!.toString().includes(filter);
          else return true;
        });
        return grid.toJSON();
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
        debounceTime(333)
      )
      .subscribe((res) => this.nameFilter$.next(res));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onAssignButton(row: HaysonDict) {
    this.serv.assignMeter(this.mainMeterId, row);
  }
}

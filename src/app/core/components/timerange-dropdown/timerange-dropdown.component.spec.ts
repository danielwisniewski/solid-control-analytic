import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimerangeDropdownComponent } from './timerange-dropdown.component';
import { StoreModule } from '@ngrx/store';
import {
  initialState,
  timerangeReducer,
} from '../../store/timerange/timerange.reducer';
import { setActiveTimerange } from '../../store/timerange/timerange.actions';
import {
  BsLocaleService,
  BsDatepickerConfig,
  BsDaterangepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { TimerangeStore } from 'src/app/core/store/timerange.store';
import { of } from 'rxjs';

describe('TimerangeDropdownComponent', () => {
  let component: TimerangeDropdownComponent;
  let fixture: ComponentFixture<TimerangeDropdownComponent>;
  let timerangeStore: TimerangeStore;
  let bsLocaleService: BsLocaleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerangeDropdownComponent],
      imports: [
        StoreModule.forRoot({ timerange: timerangeReducer }, {
          initialState,
        } as any),
      ],
      providers: [BsLocaleService, TimerangeStore],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerangeDropdownComponent);
    component = fixture.componentInstance;
    timerangeStore = TestBed.inject(TimerangeStore);
    bsLocaleService = TestBed.inject(BsLocaleService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch setActiveTimerange action when onHidden is called', () => {
    spyOn(timerangeStore, 'dispatch');
    const dates = 'toSpan(2023-01-01)';
    component.onHidden([new Date(2023, 0, 1)]);
    expect(timerangeStore['dispatch']).toHaveBeenCalledWith(
      setActiveTimerange({ dates })
    );
  });

  it('should display the formatted active timerange', () => {
    const activeTimerange = 'toSpan(2023-01-01)';
    const displayText = 'January 1, 2023';
    spyOnProperty(timerangeStore, 'select').and.returnValue(
      of(activeTimerange)
    );
    fixture.detectChanges();
    const buttonText = fixture.nativeElement
      .querySelector('.dropdown-toggle')
      .textContent.trim();
    expect(buttonText).toBe(displayText);
  });

  it('should set bsDateRangeConfig and bsDateConfig properties', () => {
    const bsDateRangeConfig: BsDaterangepickerConfig = {
      displayMonths: 0,
      adaptivePosition: false,
      useUtc: false,
      isAnimated: false,
      startView: 'year',
      returnFocusToInput: false,
      containerClass: '',
      showWeekNumbers: false,
      dateInputFormat: '',
      rangeSeparator: '',
      rangeInputFormat: '',
      monthTitle: '',
      yearTitle: '',
      dayLabel: '',
      monthLabel: '',
      yearLabel: '',
      weekNumbers: '',
      showTodayButton: false,
      showClearButton: false,
      todayPosition: '',
      clearPosition: '',
      todayButtonLabel: '',
      clearButtonLabel: '',
      customRangeButtonLabel: '',
      withTimepicker: false,
      allowedPositions: [],
    };

    const bsDateConfig: BsDatepickerConfig = {
      adaptivePosition: false,
      useUtc: false,
      isAnimated: false,
      startView: 'year',
      returnFocusToInput: false,
      containerClass: '',
      displayMonths: 0,
      showWeekNumbers: false,
      dateInputFormat: '',
      rangeSeparator: '',
      rangeInputFormat: '',
      monthTitle: '',
      yearTitle: '',
      dayLabel: '',
      monthLabel: '',
      yearLabel: '',
      weekNumbers: '',
      showTodayButton: false,
      showClearButton: false,
      todayPosition: '',
      clearPosition: '',
      todayButtonLabel: '',
      clearButtonLabel: '',
      customRangeButtonLabel: '',
      withTimepicker: false,
      allowedPositions: [],
    };

    expect(component.bsDateRangeConfig).toEqual(bsDateRangeConfig);
    expect(component.bsDateConfig).toEqual(bsDateConfig);
  });

  // Add more test cases as needed
});

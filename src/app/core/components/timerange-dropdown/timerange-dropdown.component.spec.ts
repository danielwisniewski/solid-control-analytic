import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { DateTime } from 'luxon';

import { TimerangeDropdownComponent } from './timerange-dropdown.component';
import { setActiveTimerange } from '../../store/timerange/timerange.actions';
import { plLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';

describe('TimerangeDropdownComponent', () => {
  let component: TimerangeDropdownComponent;
  let fixture: ComponentFixture<TimerangeDropdownComponent>;
  let store: Store<any>;
  let localeService: BsLocaleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})], // Add necessary imports and providers
      declarations: [TimerangeDropdownComponent],
      providers: [BsLocaleService], // Provide required dependencies
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerangeDropdownComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    localeService = TestBed.inject(BsLocaleService);

    fixture.detectChanges(); // Trigger change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct defaults', () => {
    expect(component.type).toBe('range');
    // Perform additional assertions for default values
  });

  it('should update date range config on initialization', () => {
    // Spy on the localeService.use method
    const localeServiceSpy = spyOn(localeService, 'use');
    // Spy on the defineLocale function from ngx-bootstrap
    const defineLocaleSpy = spyOn(defineLocale, 'call' as never);

    component.ngOnInit();

    expect(localeServiceSpy).toHaveBeenCalledWith('pl');
    expect(defineLocaleSpy).toHaveBeenCalledWith(
      'pl' as never,
      plLocale as never
    );
    // Perform additional assertions for the updated configuration
  });

  it('should update the active timerange on hidden event', () => {
    const dates = [new Date(), new Date()]; // Mock dates

    // Dispatch the setActiveTimerange action when onHidden is called
    const dispatchSpy = spyOn(store, 'dispatch');
    component.onHidden(dates);

    expect(dispatchSpy).toHaveBeenCalledWith(
      setActiveTimerange({ dates: 'toDateSpan(date1..date2)' })
    );
    // Perform additional assertions
  });

  it('should generate the display text correctly', () => {
    const formatSpy = spyOn(DateTime.prototype, 'toLocaleString');

    // Mock the selectActiveTimerange selector
    spyOn(store, 'select').and.returnValue(of('toDateSpan(date1..date2)'));

    component.displayText$.subscribe(() => {
      expect(formatSpy).toHaveBeenCalled();
      // Perform additional assertions
    });
  });

  // Write more unit tests to cover other methods and functionalities

  afterEach(() => {
    fixture.destroy();
  });
});

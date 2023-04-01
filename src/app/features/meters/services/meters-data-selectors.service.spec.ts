import { TestBed } from '@angular/core/testing';

import { MetersDataSelectorsService } from './meters-data-selectors.service';

describe('MetersDataSelectorsService', () => {
  let service: MetersDataSelectorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetersDataSelectorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

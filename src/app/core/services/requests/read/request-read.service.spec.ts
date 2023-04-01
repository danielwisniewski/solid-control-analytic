import { TestBed } from '@angular/core/testing';

import { RequestReadService } from './request-read.service';

describe('RequestReadService', () => {
  let service: RequestReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

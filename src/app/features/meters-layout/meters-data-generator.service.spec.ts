import { TestBed } from '@angular/core/testing';

import { MetersDataGeneratorService } from './meters-data-generator.service';

describe('MetersDataGeneratorService', () => {
  let service: MetersDataGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetersDataGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

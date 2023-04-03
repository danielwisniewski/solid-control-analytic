import { TestBed } from '@angular/core/testing';

import { ToastrPopupService } from './toastr-popup.service';

describe('ToastrPopupService', () => {
  let service: ToastrPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

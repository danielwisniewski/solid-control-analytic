import { Injectable } from '@angular/core';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';

import * as data from '../../../../assets/configs/meters-list/meters.config.json';

@Injectable({
  providedIn: 'root',
})
export class MetersDataSelectorsService {
  constructor(private readData: RequestReadService) {}
}

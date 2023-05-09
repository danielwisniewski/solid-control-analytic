import { Injectable } from '@angular/core';
import { HDict, HRef, HaysonDict } from 'haystack-core';

@Injectable({
  providedIn: 'root',
})
export class TreeStatusService {
  constructor() {}

  expandedRows: string[] = [];

  onTreeAction(row: HaysonDict, action: 'expand' | 'collapse') {
    const id = HDict.make(row).get<HRef>('id')?.toZinc(true);
    if (!id) return;

    if (action === 'expand') {
      this.expandedRows.push(id);
    } else if (action === 'collapse') {
      const index = this.expandedRows.findIndex((r) => r === id);
      if (index > -1) this.expandedRows.splice(index, 1);
    }
  }
}

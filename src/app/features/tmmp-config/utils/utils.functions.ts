import { TableColumn } from '@swimlane/ngx-datatable';
import { HStr } from 'haystack-core';

export function formatHaystackValue(value: any) {
  if (value._kind && value._kind === 'ref') return value.dis;
  return value;
}

export function createTableColumnsConfig(
  columns: any,
  component: any
): TableColumn[] {
  let result: TableColumn[] = [];
  columns.forEach((row: any) => {
    if (typeof row.cellTemplateName !== 'undefined') {
      if (Object.keys(component).some((r) => r == row.cellTemplateName)) {
        result.push({
          ...row,
          cellTemplate:
            Object.entries(component).find(
              (r) => r[0] == row.cellTemplateName
            )![1] || null,
        });
      }
    } else result.push(row);
  });
  return result;
}

export function sortByStoreNum(a: any, b: any) {
  const storeNumA = Number(a['storeNum'] ?? 0);
  const storeNumB = Number(b['storeNum'] ?? 0);
  return storeNumA - storeNumB;
}

export function queryToZinc(query: string) {
  return HStr.make(query).toZinc();
}

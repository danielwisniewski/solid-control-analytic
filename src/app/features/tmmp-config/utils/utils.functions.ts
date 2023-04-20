import { TableColumn } from '@swimlane/ngx-datatable';
import { HStr } from 'haystack-core';

export function formatHaystackValue(value: any) {
  if (value._kind && value._kind === 'ref') return value.dis;
  if (value._kind && value._kind === 'number') {
    let unit = value.unit || '';
    if (unit.startsWith('_')) unit = unit.substring(1);
    return `${value.val.toFixed(1)} ${unit}`;
  }
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

export function generateRowColors(row: any) {
  return {
    'indirect-production-meter-row':
      row.hasOwnProperty('indirectProductionMeter') ||
      row.hasOwnProperty('compressorsMeter') ||
      row.hasOwnProperty('ventilationMeter'),
    'general-load-total-meter':
      row.hasOwnProperty('generalLoadTotalMeter') ||
      row.hasOwnProperty('generalLoadMeter'),
    'non-production-meter-row':
      row.hasOwnProperty('nonProductionTotalMeter') ||
      row.hasOwnProperty('nonProductionMeter'),
    'production-total-meter-row': row.hasOwnProperty(
      'productionDepartmentMeter'
    ),
    'production-total-row':
      row.hasOwnProperty('productionTotalMeter') ||
      row.hasOwnProperty('indirectProductionTotalMeter') ||
      row.hasOwnProperty('compressorsTotalMeter') ||
      row.hasOwnProperty('ventilationTotalMeter'),
    'production-meter-row': row.hasOwnProperty('productionLineMeter'),
    'site-meter-row': row.hasOwnProperty('costCenterSiteMeter'),
  };
}

export function templateLogic(row: any) {
  const rowIndentation = {
    'margin-left':
      row.hasOwnProperty('productionLineMeter') ||
      row.hasOwnProperty('compressorsMeter') ||
      row.hasOwnProperty('ventilationMeter')
        ? '4rem'
        : row.hasOwnProperty('costCenterMeter') ||
          row.hasOwnProperty('compressorsTotalMeter') ||
          row.hasOwnProperty('ventilationTotalMeter')
        ? '2rem'
        : '0px',
  };
  const addButtonVisible: boolean =
    (!row.hasOwnProperty('costCenterSiteMeter') &&
      row.hasOwnProperty('costCenterMainMeter') &&
      !row.hasOwnProperty('gas') &&
      !row.hasOwnProperty('indirectProductionTotalMeter')) ||
    row.hasOwnProperty('productionDepartmentMeter');

  const deleteButtonVisible: boolean =
    (row.hasOwnProperty('costCenterMeter') && !row.hasOwnProperty('gas')) ||
    row.hasOwnProperty('gasStation');

  return {
    rowIndentation: rowIndentation,
    addButtonVisible: addButtonVisible,
    deleteButtonVisible: deleteButtonVisible,
  };
}

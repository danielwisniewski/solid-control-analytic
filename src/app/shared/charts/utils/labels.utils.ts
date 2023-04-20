import { HDateTime, HGrid, HRef, HTime, Kind } from 'haystack-core';
import { generateLabelName } from './dataset.util';

export function generateLabels(grid: HGrid): string[] {
  if (grid.isEmpty()) return [];

  const isTimeseries = grid.getColumn(0)?.name === 'ts';

  if (isTimeseries) return generateTimeseriesLabels(grid);
  else {
    const ALL_LABELS = grid.getColumnNames();
    return ALL_LABELS.map((label: string, index: number) => {
      return generateLabelName(grid, index);
    });
  }
}

function generateTimeseriesLabels(grid: HGrid): string[] {
  return grid.listBy<HDateTime | HTime>('ts').map((ts) => {
    if (ts.isKind(Kind.DateTime)) return HDateTime.make(ts.value).iso;
    else return HTime.make(ts.value).value;
  });
}

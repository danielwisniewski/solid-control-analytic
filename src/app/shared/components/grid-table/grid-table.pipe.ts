import { Pipe, PipeTransform } from '@angular/core';
import { HDateTime, HNum, HRef, HVal, Kind } from 'haystack-core';

@Pipe({
  name: 'gridTable',
})
export class GridTablePipe implements PipeTransform {
  transform(value: HVal, ...args: unknown[]): unknown {
    if (value.isKind(Kind.Ref)) return (value as HRef).dis;
    else if (value.isKind(Kind.Number)) {
      let unit = (value as HNum).unit?.toString();
      if (unit?.startsWith('_')) unit = unit.substring(1);
      return `${(value as HNum).value.toFixed(2)} ${unit}`;
    } else if (value.isKind(Kind.DateTime))
      return (value as HDateTime).date.toLocaleString();
    else return value.toString();
  }
}

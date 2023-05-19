import { Pipe, PipeTransform } from '@angular/core';
import {
  HBool,
  HDateTime,
  HMarker,
  HNum,
  HRef,
  HStr,
  HaysonNum,
  HaysonRef,
  Kind,
} from 'haystack-core';
import { calculatePrecision } from '../../charts/utils/dataset.util';

@Pipe({
  name: 'gridTable',
})
export class GridTablePipe implements PipeTransform {
  transform(val: HaysonNum | HaysonRef | any, ...args: unknown[]): unknown {
    if (!val) return undefined;
    let value: HNum | HRef | HStr | HDateTime | HMarker | HBool =
      HStr.make('-');
    if (val._kind === 'ref') value = HRef.make(val);
    else if (val._kind === 'number') value = HNum.make(val);
    else if (val._kind === 'dateTime') value = HDateTime.make(val);
    else if (val._kind === 'marker') return true;
    else if (!!val) value = HStr.make(val);

    if (value.isKind(Kind.Ref)) return (value as HRef).dis;
    else if (value.isKind(Kind.Number)) {
      let unit = (value as HNum).unit?.toString();
      if (unit?.startsWith('_')) unit = unit.substring(1);
      const formattedValue = calculatePrecision(value as HNum);
      return `${formattedValue} ${unit}`;
    } else if (value.isKind(Kind.DateTime))
      return (value as HDateTime).date.toLocaleString();
    else return value.toString();
  }
}

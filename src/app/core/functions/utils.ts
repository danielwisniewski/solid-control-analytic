import { HStr } from 'haystack-core';

export function queryToZinc(query: string) {
  return HStr.make(query).toZinc();
}

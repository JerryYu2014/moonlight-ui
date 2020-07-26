import { makePy } from 'moonlight-utils';

export function add(a: number, b: number): number {
  return a + b;
}

export function makePinyin(str: String, extractFirst: boolean): String {
  return makePy(str, extractFirst);
}
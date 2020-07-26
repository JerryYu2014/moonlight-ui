import Utils, { Pinyin } from 'moonlight-utils';

export function add(a: number, b: number): number {
  let utils = new Utils();
  return utils.add(a, b);
}

export function makePy(str: String, extractFirst: boolean): String {
  let py = new Pinyin();
  return py.makePy(str, extractFirst);
}
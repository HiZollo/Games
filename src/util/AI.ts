import { sleep } from "./Functions";
import { Range } from "../struct/Range";

export class AI extends null {
  static async FinalCode(range: Range): Promise<number> {
    await sleep(3e3, null);
    let query: number;
    do {
      const rand = Math.random();
      const mappedRand = 4 * ((rand - 0.5)**3) + 0.5;
      query = Math.round(mappedRand * (range.max - range.min - 2) + range.min + 1);
    } while (!range.inOpenRange(query));
    return query;
  }
}
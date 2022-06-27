import { HZGError, HZGTypeError, ErrorCodes } from '../errors';
import { Game, Range } from '../struct';
import { IFinalCode, FinalCodeOptions } from '../types/interfaces'
import { GameUtil } from '../util/GameUtil';

export class FinalCode extends Game implements IFinalCode {
  public answer: number;
  public range: Range;

  
  constructor({ players, range = new Range(1, 1000) }: FinalCodeOptions) {
    if (range.interval <= 2) {
      throw new HZGError(ErrorCodes.InvalidRangeLength);
    }

    super({ playerManagerOptions: { players } });

    this.answer = 0;
    this.range = range;
  }

  initialize(): void {
    super.initialize();

    this.answer = GameUtil.randomInt(this.range.min + 1, this.range.max - 1);
  }

  guess(query: number): 1 | 0 | -1 {
    if (query !== ~~query) {
      throw new HZGTypeError(ErrorCodes.FinalCodeQueryType);
    }

    if (this.range.inOpenRange(query)) {
      if (query <= this.answer) this.range.min = query;
      if (query >= this.answer) this.range.max = query;
    }

    if (query > this.answer) return 1
    if (query < this.answer) return -1
    return 0;
  }

  win() {
    return this.range.min === this.range.max;
  }
}
import { FinalCodeInterface, FinalCodeOptions } from '../types/interfaces'
import { Game } from '../struct/Game';
import { Range } from '../struct/Range';
import { GameUtil } from '../util/GameUtil';

export class FinalCode extends Game implements FinalCodeInterface {
  public answer: number;
  public range: Range;

  constructor({ players, range = new Range(1, 1000) }: FinalCodeOptions) {
    if (range.interval <= 2) {
      throw new Error('The length of the interval should be larger than 2.');
    }

    super({ playerManagerOptions: { players } });

    this.answer = 0;
    this.range = range;
  }

  initialize() {
    super.initialize();

    this.answer = GameUtil.randomInt(this.range.min + 1, this.range.max - 1);
  }

  guess(query: number): 1 | 0 | -1 {
    if (query !== ~~query) {
      throw new Error(`The query should be an integer.`);
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
import { HZGError, HZGRangeError, ErrorCodes } from '../errors';
import { IBullsAndCows, BullsAndCowsOptions, BullsAndCowsResult } from '../types/interfaces'
import { Game } from '../struct/Game';
import { Range } from '../struct/Range';
import { GameUtil } from '../util/GameUtil';

export class BullsAndCows extends Game implements IBullsAndCows {
  public answer: number[];
  public answerLength: number;
  public numberCount: number;

  
  constructor({ players, answerLength = 4 }: BullsAndCowsOptions) {
    if (!(1 <= answerLength && answerLength <= 10)) {
      throw new HZGRangeError(ErrorCodes.OutOfRange, "Parameter answerLength", 1, 10);
    }

    super({ playerManagerOptions: { players, playerCountRange: new Range(1, 1) } });

    this.answer = [];
    this.answerLength = answerLength;
    this.numberCount = 10;
  }

  initialize(): void {
    super.initialize();

    const numbers = [];
    for (let i = 0; i < this.numberCount; i++) {
      numbers.push(i)
    }

    GameUtil.shuffle(numbers);

    for (let i = 0; i < this.answerLength; i++) {
      this.answer.push(numbers[i]);
    }
  }

  guess(query: number[]): BullsAndCowsResult {
    if (query.length !== this.answerLength) {
      throw new HZGError(ErrorCodes.BullsAndCowsQueryLength, query, this.answerLength);
    }
    if ((new Set(query)).size !== query.length) {
      throw new HZGError(ErrorCodes.BullsAndCowsDuplicatedNumbers, query);
    }

    let result = { a: 0, b: 0 };
    for (let i = 0; i < this.answerLength; i++)
      for (let j = 0; j < this.answerLength; j++)
        if (query[i] == this.answer[j]) {
          if (i === j) result.a++;
          else result.b++;
        }

    return result;
  }

  win(result: BullsAndCowsResult): boolean {
    return result.a === this.answerLength;
  }
}
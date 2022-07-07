import { HZGRangeError, ErrorCodes } from '../errors';
import { Game, Range } from '../struct';
import { IFlipTrip, FlipTripOptions } from '../types'

export class FlipTrip extends Game implements IFlipTrip {
  public boardSize: number;
  public state: number;
  public appearedStates: number[];
  public permutationCount: number;


  constructor({ players, boardSize = 3 }: FlipTripOptions ) {
    if (!(1 <= boardSize && boardSize <= 10)) {
      throw new HZGRangeError(ErrorCodes.OutOfRange, "Parameter boardSize", 1, 10);
    }

    super({ playerManagerOptions: { players, playerCountRange: new Range(1, 1) } });

    this.boardSize = boardSize;
    this.state = 0;
    this.appearedStates = [];
    this.permutationCount = 2 ** boardSize;
  }

  initialize(): void {
    super.initialize();

    for (let i = 0; i < this.permutationCount; i++)
      this.appearedStates.push(0);
    this.appearedStates[this.state] = 1;
  }

  flip(location: number): boolean {
    this.state ^= (1 << location);

    if (this.appearedStates[this.state]) {
      return false;
    }
    this.appearedStates[this.state] = 1;
    return true;
  }

  win(): boolean {
    return this.playerManager.totalSteps === this.permutationCount - 1;
  }
}
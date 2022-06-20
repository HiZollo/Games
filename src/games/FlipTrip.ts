import { FlipTripInterface, FlipTripOptions } from '../types/interfaces'
import { Game } from '../struct/Game';
import { Range } from '../struct/Range';

export class FlipTrip extends Game implements FlipTripInterface {
  public boardSize: number;
  public state: number;
  public appearedStates: number[];

  protected permutationCount: number;

  constructor({ players, boardSize = 3 }: FlipTripOptions ) {
    if (boardSize > 10) {
      throw new Error('The size of the board should be at most 10.');
    }

    super({ playerManagerOptions: { players, playerCountRange: new Range(1, 1) } });

    this.boardSize = boardSize;
    this.state = 0;
    this.appearedStates = [];
    this.permutationCount = 2 ** boardSize;
  }

  initialize() {
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

module.exports = FlipTrip;
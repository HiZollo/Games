import { PlayerManagerOptions } from '../types/interfaces';
import { Player } from './Player';
import { Range } from './Range';

export class PlayerManager {
  public players: Player[];
  public playerCount: number;
  public index: number;
  private lastMoveTime: number;


  constructor({ players, playerCountRange, requireSymbol = false, firstPlayerIndex = 0 }: PlayerManagerOptions) {
    if (!playerCountRange) {
      playerCountRange = new Range(1, Infinity);
    }
    if (!playerCountRange.inClosedRange(players.length)) {
      throw new Error(`The player count should be in interval [${playerCountRange.min}, ${playerCountRange.max}]`);
    }
    this.players = players.map(p => new Player(p));
    if (requireSymbol && this.players.find(p => p.symbol == null)) {
      throw new Error('You should provide symbols for all players');
    }

    this.playerCount = players.length;
    this.index = firstPlayerIndex;
    this.lastMoveTime = Date.now();
  }

  get nowPlayer(): Player {
    return this.players[this.index];
  }

  get totalSteps(): number {
    return this.players.reduce((acc, cur) => acc + cur.steps, 0);
  }

  get usernames(): string[] {
    return this.players.map(p => p.username);
  }

  get ids(): (number | string)[] {
    return this.players.map(p => p.id);
  }

  get alive(): boolean {
    return this.players.some(p => p.status.now === "PLAYING");
  }

  assign(nextIndex: number): void {
    const time = Date.now();
    this.nowPlayer.addTime(time - this.lastMoveTime);
    this.lastMoveTime = time;

    const index = nextIndex % this.playerCount;
    this.index = index < 0 ? index + this.playerCount : index;
  }

  next(n = 1): void {
    this.assign(this.index + n)
  }

  prev(n = 1): void {
    this.assign(this.index - n)
  }
}
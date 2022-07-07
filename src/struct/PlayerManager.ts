import { Player, Range } from './';
import { HZGError, HZGRangeError, ErrorCodes } from '../errors';
import { PlayerManagerOptions } from '../types';

export class PlayerManager {
  public players: Player[];
  public playerCount: number;
  public inGamePlayerCount: number;
  public index: number;
  private lastMoveTime: number;


  constructor({ players, playerCountRange = new Range(1, Infinity), requireSymbol = false, firstPlayerIndex = 0 }: PlayerManagerOptions) {
    if (!playerCountRange.inClosedRange(players.length)) {
      throw new HZGRangeError(ErrorCodes.OutOfRange, "The number of the players", playerCountRange.min, playerCountRange.max);
    }

    this.players = players.map(p => new Player(p));
    
    if (this.players.every(p => p.bot)) {
      throw new HZGError(ErrorCodes.HumanRequired);
    }
    const ids = this.ids;
    if (ids.length !== (new Set(ids)).size) {
      throw new HZGError(ErrorCodes.DuplicatedIds);
    }
    if (requireSymbol) {
      if (this.players.find(p => p.symbol === null)) {
        throw new HZGError(ErrorCodes.SymbolRequired);
      }
      const symbols = this.symbols;
      if (symbols.length !== (new Set(symbols)).size) {
        throw new HZGError(ErrorCodes.DuplicatedSymbols);
      }
    }

    this.playerCount = players.length;
    this.inGamePlayerCount = this.playerCount;
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
    return this.players.filter(p => p.status.now !== "LEFT").map(p => p.username);
  }

  get ids(): (number | string)[] {
    return this.players.filter(p => p.status.now !== "LEFT").map(p => p.id);
  }

  get symbols(): (string | null)[] {
    return this.players.filter(p => p.status.now !== "LEFT").map(p => p.symbol);
  }

  get alive(): boolean {
    return this.players.some(p => p.status.now === "PLAYING");
  }

  assign(nextIndex: number): void {
    this.conclude(this.nowPlayer);
    if (!this.alive) return;
    
    let index = nextIndex % this.playerCount;
    this.index = index < 0 ? index + this.playerCount : index;
    if (this.nowPlayer.status.now === "LEFT") {
      this.next();
    }
  }

  next(n = 1): void {
    this.conclude(this.nowPlayer);
    if (!this.alive) return;
    
    this.index = (this.index + n) % this.playerCount;
    while (this.nowPlayer.status.now === "LEFT") {
      this.index = this.index + 1 === this.playerCount ? 0 : this.index + 1;
    }
  }

  prev(n = 1): void {
    this.conclude(this.nowPlayer);
    if (!this.alive) return;
    
    this.index = (this.index - n) % this.playerCount;
    this.index = this.index < 0 ? this.index + this.playerCount : this.index;
    while (this.nowPlayer.status.now === "LEFT") {
      this.index = this.index === 0 ? this.playerCount - 1 : this.index - 1;
    }
  }

  kick(id: number | string): void {
    const index = this.getIndex(id);
    if (index === -1) return;
    this.players[index].status.set("LEFT");
    this.conclude(this.players[index]);
    this.inGamePlayerCount--;
  }

  getIndex(id: number | string): number {
    const index = this.players.findIndex(p => p.id === id);
    return this.players[index].status.now === "LEFT" ? -1 : index;
  }

  private conclude(player: Player): void {
    const time = Date.now();
    player.addTime(time - this.lastMoveTime);
    this.lastMoveTime = time;
  }
}
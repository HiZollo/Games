import { GameOptions } from '../types/interfaces';
import { GameStatusManager } from './GameStatusManager';
import { Player } from './Player';
import { PlayerManager } from './PlayerManager';

export abstract class Game {
  public playerManager: PlayerManager;
  public status: GameStatusManager;
  public startTime: number | null;
  public endTime: number | null;
  public winner: Player | null;
  public loser: Player | null;
  private initialized: boolean;
  private ended: boolean;

  abstract win(...args: any[]): void;

  
  constructor({ playerManagerOptions, gameStatus = [] }: GameOptions) {
    this.playerManager = new PlayerManager(playerManagerOptions);
    this.status = new GameStatusManager(...gameStatus);

    this.startTime = null;
    this.endTime = null;

    this.winner = null;
    this.loser = null;

    this.initialized = false;
    this.ended = false;
  }

  initialize(): void {
    if (this.initialized) {
      throw new Error('The game has already been initialized.');
    }

    this.initialized = true;
    this.startTime = Date.now();
  }

  end(status: string): void {
    if (this.ended) {
      throw new Error("This game has already ended.");
    }

    this.ended = true;
    this.endTime = Date.now();
    this.status.set(status);
  }

  get duration(): number | null {
    if (this.startTime === null || this.endTime === null) return null;
    return this.endTime - this.startTime;
  }

  get ongoing(): boolean {
    return this.status.now === "ONGOING";
  }
}
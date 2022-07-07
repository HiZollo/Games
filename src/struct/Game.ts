import { GameStatusManager, PlayerManager } from './';
import { HZGError, ErrorCodes } from '../errors';
import { GameOptions } from '../types/interfaces';

export abstract class Game {
  public playerManager: PlayerManager;
  public status: GameStatusManager;
  public startTime: number | null;
  public endTime: number | null;
  private initialized: boolean;
  private ended: boolean;

  abstract win(...args: any[]): void;

  
  constructor({ playerManagerOptions, gameStatus = [] }: GameOptions) {
    this.playerManager = new PlayerManager(playerManagerOptions);
    this.status = new GameStatusManager({ status: gameStatus });

    this.startTime = null;
    this.endTime = null;

    this.initialized = false;
    this.ended = false;
  }

  initialize(): void {
    if (this.initialized) {
      throw new HZGError(ErrorCodes.GameAlreadyInitialized);
    }

    this.initialized = true;
    this.startTime = Date.now();
  }

  end(status: string): void {
    if (this.ended) {
      throw new HZGError(ErrorCodes.GameAlreadyEnded);
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
import { PlayerOptions } from '../types/interfaces';
import { PlayerStatusManager } from './PlayerStatusManager';

export class Player {
  public bot: boolean;
  public id: number | string;
  public symbol: string | null;
  public username: string;
  public status: PlayerStatusManager;
  public steps: number;
  public time: number;

  
  constructor({ bot = false, id, symbol = null, username = 'Player' }: PlayerOptions) {
    this.bot = bot
    this.id = id;
    this.symbol = symbol;
    this.username = username;

    this.status = new PlayerStatusManager({ initial: this.bot ? "BOT" : "PLAYING", status: [] });
    this.steps = 0;
    this.time = 0;
  }

  addStep(step: number = 1): void {
    this.steps += step;
  }

  addTime(time: number = 0): void {
    this.time += time;
  }
}
import { StatusManagerOptions } from '../types/interfaces';
import { StatusManager } from './StatusManager';

export class PlayerStatusManager extends StatusManager {
  constructor({ initial, status }: StatusManagerOptions) {
    super({ initial, status: ["PLAYING", "BOT", "IDLE", "LEAVING", ...status] });
  }

  set(status: string): void {
    if (this.now === "BOT") {
      throw new Error('You cannot set a bot\'s status.');
    }
    if (status === "BOT") {
      throw new Error('You cannot set a player\'s status to bot.')
    }

    super.set(status);
  }
}
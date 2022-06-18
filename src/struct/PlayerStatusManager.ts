import { StatusManager } from './StatusManager';

export class PlayerStatusManager extends StatusManager {
  constructor(...status: string[]) {
    super("PLAYING", "BOT", "IDLE", "LEAVING", ...status);
  }

  set(status: string): void {
    if (status === "BOT") {
      throw new Error('You cannot set a bot\'s status.');
    }

    super.set(status);
  }
}
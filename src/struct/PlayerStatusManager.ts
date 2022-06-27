import { HZGError, ErrorCodes } from '../errors';
import { StatusManagerOptions } from '../types/interfaces';
import { StatusManager } from './StatusManager';

export class PlayerStatusManager extends StatusManager {
  constructor({ initial, status }: StatusManagerOptions) {
    super({ initial, status: ["PLAYING", "BOT", "IDLE", "LEAVING", ...status] });
  }

  set(status: string): void {
    if (this.now === "BOT") {
      throw new HZGError(ErrorCodes.StatusSetFromBot);
    }
    if (status === "BOT") {
      throw new HZGError(ErrorCodes.StatusSetToBot)
    }

    super.set(status);
  }
}
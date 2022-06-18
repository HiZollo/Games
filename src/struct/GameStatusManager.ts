import { StatusManager } from './StatusManager';

export class GameStatusManager extends StatusManager {
  constructor(...status: string[]) {
    super("ONGOING", "WIN", "DRAW", "LOSE", "STOPPED", "IDLE", "DELETED", ...status);
  }
}
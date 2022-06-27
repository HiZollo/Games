import { StatusManager } from './StatusManager';
import { StatusManagerOptions } from '../types/interfaces';

export class GameStatusManager extends StatusManager {
  constructor({ initial, status }: StatusManagerOptions) {
    super({ initial, status: ["ONGOING", "WIN", "DRAW", "LOSE", "STOPPED", "IDLE", "DELETED", ...status] });
  }
}
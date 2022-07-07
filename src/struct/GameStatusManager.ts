import { StatusManager } from './';
import { StatusManagerOptions } from '../types';

export class GameStatusManager extends StatusManager {
  constructor({ initial, status }: StatusManagerOptions) {
    super({ initial, status: ["ONGOING", "WIN", "DRAW", "LOSE", "STOPPED", "IDLE", "DELETED", ...status] });
  }
}
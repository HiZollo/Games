import { HZGError, ErrorCodes } from '../errors';
import { StatusManagerOptions } from "../types/interfaces";

export class StatusManager {
  public statusCount: number;
  public statusPool: Set<string>;
  public now: string;
  

  constructor({ initial, status }: StatusManagerOptions) {
    this.statusCount = 0;
    this.statusPool = new Set();

    this.append(...status);
    this.now = initial && this.has(initial) ? initial : status[0];
  }

  append(...status: string[]): void {
    status.forEach(s => {
      this.statusPool.add(s);
      this.statusCount++;
    });
  }

  has(status: string): boolean {
    return this.statusPool.has(status);
  }

  set(status: string): void {
    if (!this.has(status)) {
      throw new HZGError(ErrorCodes.StatusNotFound, status);
    }

    this.now = status;
  }
}
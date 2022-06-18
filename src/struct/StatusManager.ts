export class StatusManager {
  public statusCount: number;
  public statusPool: Set<string>;
  public now: string;
  

  constructor(...status: string[]) {
    this.statusCount = 0;
    this.statusPool = new Set();

    this.append(...status);
    this.now = status[0];
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
      throw new Error(`Status ${status} does not exist.`);
    }

    this.now = status;
  }
}
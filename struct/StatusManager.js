class StatusManager {
  constructor(...status) {
    this.statusCount = 0;
    this.statusPool = new Set();

    this.append(...status);
    this.now = status[0];
  }

  append(...status) {
    status.forEach(s => {
      this.statusPool.add(s);
      this.statusCount++;
    });
  }

  has(status) {
    return this.statusPool.has(status);
  }

  set(status) {
    if (!this.has(status)) {
      throw new Error(`Status ${status} does not exist.`);
    }

    this.now = status;
  }
}

module.exports = StatusManager;

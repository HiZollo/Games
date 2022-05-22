class Status {
  constructor(...status) {
    this._statusCount = 0;
    this._statusPool = new Set();

    this.append(status);
    this.now = status[0];
  }

  append(status) {
    status.forEach(s => {
      this._statusPool.add(s);
    });
  }

  has(status) {
    return this._statusPool.has(status);
  }

  set(status) {
    if (!this.has(status)) {
      throw new Error(`Status ${status} does not exist.`);
    }

    this.now = status;
  }
}

module.exports = Status;

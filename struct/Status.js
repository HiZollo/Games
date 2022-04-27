class Status {
  constructor(...status) {
    this._statusCount = 0;
    this._statusPool = [];

    this.append(status);
    this.now = status[0];
  }

  append(status) {
    status.forEach(s => {
      if (this.has(s)) {
        throw new Error(`Status ${status} already exists.`);
      }
      this._statusPool.push(s);
    });
  }

  has(status) {
    return this._statusPool.includes(status);
  }

  set(status) {
    if (!this.has(status)) {
      throw new Error(`Status ${status} does not exist.`);
    }

    this.now = status;
  }
}

module.exports = Status;

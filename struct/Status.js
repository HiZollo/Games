class Status {
  constructor(...status) {
    this._statusCount = 0;

    this.FLAGS = {};
    this.append(status);
    this.now = this.FLAGS[status[0]];
  }

  append(status) {
    status.forEach(s => {
      if (this.has(s)) {
        throw new Error(`Status ${status} already exists.`);
      }

      Object.defineProperty(this.FLAGS, s, {
        value: this._statusCount++,
        enumerable: true
      });
    });
  }

  has(status) {
    return Object.keys(this.FLAGS).includes(status);
  }

  is(...status) {
    return status.some(s => this.now === this.FLAGS[s]);
  }

  set(status) {
    if (!this.has(status)) {
      throw new Error(`Status ${status} does not exist.`);
    }

    this.now = this.FLAGS[status];
  }
}

module.exports = Status;

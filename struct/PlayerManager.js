const Player = require('./Player.js');

class PlayerManager {
  constructor({ players, firstPlayerIndex = 0 }) {
    this.players = players.map(p => new Player(p));
    this.playerCount = players.length;
    this._index = firstPlayerIndex;
    this._lastMoveTime = Date.now();
  }

  // 現在輪到的玩家
  get nowPlayer() {
    return this.players[this._index];
  }

  get totalSteps() {
    return this.players.reduce((acc, cur) => acc + cur.steps, 0);
  }

  get usernames() {
    return this.players.map(p => p.username);
  }

  get ids() {
    return this.players.map(p => p.id);
  }

  get alive() {
    return this.players.some(p => p.status.now === "PLAYING");
  }

  // 上一位玩家
  prev(n = 1) {
    const time = Date.now();
    this.nowPlayer.time += time - this._lastMoveTime;
    this._lastMoveTime = time;

    const index = (this._index - n) % this.playerCount
    this._index = index < 0 ? index + this.playerCount : index;
  }

  // 下一位玩家
  next(n = 1) {
    const time = Date.now();
    this.nowPlayer.time += time - this._lastMoveTime;
    this._lastMoveTime = time;

    this._index = (this._index + n) % this.playerCount;
  }

  // 指定下家
  assign(nextIndex) {
    const time = Date.now();
    this.nowPlayer.time += time - this._lastMoveTime;
    this._lastMoveTime = time;

    this._index = nextIndex % this.playerCount;
  }
}

module.exports = PlayerManager;

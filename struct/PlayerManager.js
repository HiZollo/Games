const Player = require('./Player.js');

class PlayerManager {
  constructor({ players, playerCountRange = [0, Infinity], requireSymbol = false, firstPlayerIndex = 0 }) {
    if (players.length < playerCountRange[0]) {
      throw new Error(`The player count should be larger than or equal to ${playerCountRange[0]}`);
    }
    if (playerCountRange[1] < players.length) {
      throw new Error(`The player count should be less than or equal to ${playerCountRange[1]}`);
    }

    this.players = players.map(p => new Player(p));
    if (requireSymbol && this.players.find(p => p.symbol == null)) {
      throw new Error('You should provide symbols for all players');
    }

    this.playerCount = players.length;
    this._index = firstPlayerIndex;
    this._lastMoveTime = Date.now();
  }

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

  prev(n = 1) {
    const time = Date.now();
    this.nowPlayer.time += time - this._lastMoveTime;
    this._lastMoveTime = time;

    const index = (this._index - n) % this.playerCount
    this._index = index < 0 ? index + this.playerCount : index;
  }

  next(n = 1) {
    const time = Date.now();
    this.nowPlayer.time += time - this._lastMoveTime;
    this._lastMoveTime = time;

    this._index = (this._index + n) % this.playerCount;
  }

  assign(nextIndex) {
    const time = Date.now();
    this.nowPlayer.time += time - this._lastMoveTime;
    this._lastMoveTime = time;

    this._index = nextIndex % this.playerCount;
  }
}

module.exports = PlayerManager;

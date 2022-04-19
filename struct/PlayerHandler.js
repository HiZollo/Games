const Player = require('./Player.js');
const { PlayerStatus } = require('../util/Constants.js');

class PlayerHandler {
  constructor({ players, firstPlayerIndex = 0 }) {
    this.players = players.map(p => new Player(p));
    this.playerCount = players.length;
    this._index = firstPlayerIndex;
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
    return !this.players.find(p => p.status === PlayerStatus.WINNER) && this.players.find(p => p.status === PlayerStatus.PLAY);
  }

  // 上一位玩家
  prev(n = 1) {
    const index = (this._index - n) % this.playerCount
    this._index = index < 0 ? index + this.playerCount : index;
  }

  // 下一位玩家
  next(n = 1) {
    this._index = (this._index + n) % this.playerCount;
  }

  // 指定下家
  assign(nextIndex) {
    this._index = nextIndex % this.playerCount;
  }
}

module.exports = PlayerHandler;

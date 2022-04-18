const Player = require('./Player.js');
const { PlayerStatus } = require('../util/Constants.js');

class PlayerHandler {
  constructor({ players, firstPlayerIndex = 0 }) {
    this.players = players.map(p => new Player(p));
    this.playerCount = players.length;
    this.lastEndGameStatus = PlayerStatus.PLAYING;
    this.index = firstPlayerIndex;
  }

  // 現在輪到的玩家
  get nowPlayer() {
    return this.players[this.index];
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

  // 上一位玩家
  prev(n = 1) {
    const index = (this.index - n) % this.playerCount
    this.index = index < 0 ? index + this.playerCount : index;
  }

  // 下一位玩家
  next(n = 1) {
    this.index = (this.index + n) % this.playerCount;
  }

  // 指定下家
  assign(nextIndex) {
    this.index = nextIndex % this.playerCount;
  }
}

module.exports = PlayerHandler;

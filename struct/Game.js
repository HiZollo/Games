const PlayerHandler = require('./PlayerHandler.js');

class Game {
  constructor(gameName, playerHandlerOptions) {
    this.gameName = gameName;
    this.playerHandler = new PlayerHandler(playerHandlerOptions);
    this._initialized = false;
    this.startTime = null;
    this.endTime = null;
    this.ended = false;
    this.endReason = null;
  }

  // 初始化
  initialize() {
    if (this._initialized) {
      throw new Error('The game has already been initialized.');
    }

    this.startTime = Date.now();
    this._initialized = true;
  }

  // 結束遊戲
  end(endReason) {
    if (this.ended)
      throw new Error("This game has already ended.");

    this.ended = true;
    this.endTime = Date.now();
    this.endReason = endReason;
  }

  // 獲得遊戲總時長（單位為毫秒）
  get duration() {
    if (this.endTime === null) return null;
    return this.endTime - this.startTime;
  }

  static shuffle(array, length) {
    for (let i = length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

module.exports = Game;

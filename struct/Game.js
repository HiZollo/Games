const GameStatus = require('./GameStatus.js');
const PlayerManager = require('./PlayerManager.js');

class Game {
  constructor(playerManagerOptions, gameStatus = []) {
    this.playerManager = new PlayerManager(playerManagerOptions);
    this.status = new GameStatus(...gameStatus);

    this.startTime = null;
    this.endTime = null;

    this.winner = null;
    this.loser = null;

    this._initialized = false;
    this._ended = false;
  }

  initialize() {
    if (this._initialized) {
      throw new Error('The game has already been initialized.');
    }

    this._initialized = true;
    this.startTime = Date.now();
  }

  end(status) {
    if (this._ended) {
      throw new Error("This game has already ended.");
    }

    this._ended = true;
    this.endTime = Date.now();
    this.status.set(status);
  }

  get duration() {
    if (this.endTime === null) return null;
    return this.endTime - this.startTime;
  }

  get ongoing() {
    return this.status.now === "ONGOING";
  }
}

module.exports = Game;

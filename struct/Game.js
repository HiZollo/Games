const GameStatus = require('./GameStatus.js');
const PlayerHandler = require('./PlayerHandler.js');

class Game {
  constructor(name, playerHandlerOptions, gameStatus = []) {
    this.name = name;
    this.playerHandler = new PlayerHandler(playerHandlerOptions);
    this.status = new GameStatus(...gameStatus);

    this.startTime = null;
    this.endTime = null;

    this._initialized = false;
    this._ended = false;
  }

  // initialize the game
  initialize() {
    if (this._initialized) {
      throw new Error('The game has already been initialized.');
    }

    this._initialized = true;
    this.startTime = Date.now();
  }

  // Ends the game
  end(status) {
    if (this._ended) {
      throw new Error("This game has already ended.");
    }

    this._ended = true;
    this.endTime = Date.now();
    this.status.set(status);
  }

  // Gets the duration of the game
  get duration() {
    if (this.endTime === null) return null;
    return this.endTime - this.startTime;
  }

  // check if the game is still ungoing
  get ongoing() {
    return this.status.now === "ONGOING";
  }
}

module.exports = Game;

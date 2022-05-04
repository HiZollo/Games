const PlayerHandler = require('./PlayerHandler.js');

class Game {
  constructor(name, playerHandlerOptions) {
    this.name = name;
    this.playerHandler = new PlayerHandler(playerHandlerOptions);
    this._initialized = false;
    this.startTime = null;
    this.endTime = null;
    this.ended = false;
    this.endReason = null;
  }

  // initialize the game
  initialize() {
    if (this._initialized) {
      throw new Error('The game has already been initialized.');
    }

    this.startTime = Date.now();
    this._initialized = true;
  }

  // Ends the game
  end(endReason) {
    if (this.ended) {
      throw new Error("This game has already ended.");
    }

    this.ended = true;
    this.endTime = Date.now();
    this.endReason = endReason;
  }

  // Gets the duration of the game
  get duration() {
    if (this.endTime === null) return null;
    return this.endTime - this.startTime;
  }
}

module.exports = Game;

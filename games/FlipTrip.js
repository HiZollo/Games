const Game = require('../struct/Game.js');

class FlipTrip extends Game {
  constructor({ players, boardSize = 3 }) {
    if (boardSize > 10)
      throw new Error('The size of the board should be at most 10.');

    super({ players, playerCountRange: { min: 1, max: 1 } });

    this.boardSize = boardSize;
    this._permutationCount = 2 ** boardSize;
    this.state = 0;
    this._appearedStates = [];
  }

  initialize() {
    super.initialize();

    for (let i = 0; i < this._permutationCount; i++)
      this._appearedStates.push(0);
    this._appearedStates[this.state] = 1;
  }

  flip(location) {
    this.state ^= (1 << location);

    if (this._appearedStates[this.state]) {
      return false;
    }

    this._appearedStates[this.state] = 1;
    return true;
  }

  win() {
    return this.playerManager.totalSteps === this._permutationCount - 1;
  }
}

module.exports = FlipTrip;

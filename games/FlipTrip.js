const Game = require('../struct/Game.js');
const { checkStrike } = require('../util/GameUtil.js');
const { GameName } = require('../util/Constants.js');

class FlipTrip extends Game {
  constructor ({ gameLogger, players, boardSize = 10 }) {
    if (boardSize > 10)
      throw new Error('The size of the board should be at most 10.');

    super(GameName.FLIP_TRIP, { players });

    this.boardSize = boardSize;
    this._permutationCount = 2 ** boardSize;
    this.state = 0;
    this.appearedStates = [];
  }

  initialize() {
    super.initialize();

    for (let i = 0; i < this._permutationCount; i++)
      this.appearedStates.push(0);
    this.appearedStates[this.state] = 1;
  }

  flip(location) {
    this.state ^= (1 << location);

    if (this.appearedStates[this.state]) {
      return false;
    }

    this.appearedStates[this.state] = 1;
    return true;
  }

  win() {
    return this.playerManager.totalSteps === this._permutationCount - 1;
  }
}

module.exports = FlipTrip;

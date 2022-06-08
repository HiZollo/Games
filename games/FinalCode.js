const Game = require('../struct/Game.js');
const GameUtil = require('../util/GameUtil.js');

class FinalCode extends Game {
  constructor({ players, min = 1, max = 1000 }) {
    if (max - min < 2) {
      throw new Error('Maximum number should be 2 more than minimum number.');
    }

    super({ players });

    this.answer = null;
    this.min = min;
    this.max = max;
  }

  initialize() {
    super.initialize();

    this.answer = GameUtil.randomInt(this.min + 1, this.max - 1);
  }

  guess(query) {
    if (isNaN(query) || query !== ~~query) {
      throw new Error(`The query should be an integer.`);
    }

    if (this.min < query && query <= this.answer) {
      this.min = query;
    }
    if (this.answer <= query && query < this.max) {
      this.max = query;
    }

    return (query > this.answer) - (query < this.answer);
  }

  win() {
    return this.min === this.max;
  }
}

module.exports = FinalCode;

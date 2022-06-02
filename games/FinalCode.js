const Game = require('../struct/Game.js');
const { randomInt } = require('../util/GameUtil.js');

class FinalCode extends Game {
  constructor({ players, min = 1, max = 1000 }) {
    super({ players });

    this.answer = null;
    this.min = min;
    this.max = max;
  }

  initialize() {
    super.initialize();

    this.answer = randomInt(this.min + 1, this.max - 1);
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

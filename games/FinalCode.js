const Game = require('../struct/Game.js');
const { randomInt } = require('../util/GameUtil.js');
const { GameName } = require('../util/Constants.js');

class FinalCode extends Game {
  constructor ({ players, min = 1, max = 1000 }) {
    super(GameName.FINAL_CODE, { players });

    this.answer = null;
    this.min = min;
    this.max = max;
  }

  initialize() {
    super.initialize();

    this.answer = randomInt(this.min + 1, this.max - 1);
    console.log(this.answer);
  }

  guess(query) {
    if (isNaN(query) || query !== ~~query) {
      throw new Error(`The query should be an integer.`);
    }

    if (this.min < query && query < this.answer) {
      this.min = query;
    }
    if (this.answer < query && query < this.max) {
      this.max = query;
    }

    return (query > this.answer) - (query < this.answer);
  }

  win(query) {
    return query === answer;
  }
}

module.exports = FinalCode;

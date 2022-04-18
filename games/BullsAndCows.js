const Game = require('../struct/Game.js');
const { GameName } = require('../util/Constants.js');

class BullsAndCows extends Game {
  constructor ({ players, hardmode = false, answerLength = 4, numberCount = 10 }) {
    super(GameName.BULLS_AND_COWS, { players });

    this.answer = [];
    this.answerLength = answerLength;
    this.numberCount = numberCount;
    this.hardmode = hardmode;
    this.winner = null;
  }

  initialize() {
    super.initialize();

    const numbers = [];
    for (let i = 0; i < this.numberCount; i++) {
      numbers.push(i)
    }

    Game.shuffle(numbers, this.numberCount);

    for (let i = 0; i < this.answerLength; i++) {
      this.answer.push(numbers[i]);
    }
    console.log(this.answer);
  }

  guess(query) {
    if (query.length !== this.answerLength) {
      throw new Error(`The number count in query ${query} is different with the answer's length (${this.answerLength}).`);
    }
    if ((new Set(query)).size !== query.length) {
      throw new Error(`There are duplicated numbers in query ${query}.`);
    }

    let status = { a: 0, b: 0 };
    for (let i = 0; i < this.answerLength; i++)
      for (let j = 0; j < this.answerLength; j++)
        if (query[i] == this.answer[j]) {
          if (i === j) status.a++;
          else status.b++;
        }

    if (this.win(status)) {
      this.end("WIN");
      this.winner = this.playerHandler.nowPlayer;
    }
    return status;
  }

  win(status) {
    return status.a === this.answerLength;
  }
}

module.exports = BullsAndCows;

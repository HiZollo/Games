const Game = require('../struct/Game.js');
const { shuffle } = require('../util/GameUtil.js');

class BullsAndCows extends Game {
  constructor({ players, hardmode = false, answerLength = 4 }) {
    super({ players });

    this.answer = [];
    this.answerLength = answerLength;
    this.numberCount = 10;
    this.hardmode = hardmode;
  }

  initialize() {
    super.initialize();

    const numbers = [];
    for (let i = 0; i < this.numberCount; i++) {
      numbers.push(i)
    }

    shuffle(numbers);

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

    let response = { a: 0, b: 0 };
    for (let i = 0; i < this.answerLength; i++)
      for (let j = 0; j < this.answerLength; j++)
        if (query[i] == this.answer[j]) {
          if (i === j) response.a++;
          else response.b++;
        }

    return response;
  }

  win(status) {
    return status.a === this.answerLength;
  }
}

module.exports = BullsAndCows;

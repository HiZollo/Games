const Game = require('../struct/Game.js');
const { checkStrike } = require('../util/GameUtil.js');

class Gomoku extends Game {
  constructor({ players, boardSize = 19 }) {
    if (boardSize > 19) {
      throw new Error('The size of the board should be at most 19.');
    }

    super({ players, playerCountRange: [2, ], requireSymbol: true });

    this.boardSize = boardSize;
    this.playground = [];

    this._occupied = 0;
  }

  initialize() {
    super.initialize();

    for (let i = 0; i < this.boardSize; i++) {
      this.playground.push([]);
      for (let j = 0; j < this.boardSize; j++)
        this.playground[i].push(null);
    }
  }

  fill(row, col) {
    if (this.playground[row][col] !== null)
      throw new Error(`Trying to fill playground[${row}][${col}] that has already been filled.`);

    this.playground[row][col] = this.playerManager.nowPlayer.symbol;
    this._occupied++;
  }

  win(row, col) {
    return checkStrike(this.playground, row, col, 5);
  }

  draw() {
    return this._occupied === this.boardSize ** 2;
  }
}

module.exports = Gomoku;

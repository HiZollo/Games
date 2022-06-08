const Game = require('../struct/Game.js');
const GameUtil = require('../util/GameUtil.js');

class TicTacToe extends Game {
  constructor({ players, boardSize = 3 }) {
    if (boardSize > 5) {
      throw new Error('The size of the board should be at most 5.');
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
    return GameUtil.checkStrike(this.playground, row, col, this.boardSize);
  }

  draw() {
    return this._occupied === this.boardSize ** 2;
  }
}

module.exports = TicTacToe;

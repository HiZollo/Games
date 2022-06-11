const Game = require('../struct/Game.js');
const GameUtil = require('../util/GameUtil.js');

class Gomoku extends Game {
  constructor({ players, boardSize = 19 }) {
    if (boardSize > 19) {
      throw new Error('The size of the board should be at most 19.');
    }

    super({ players, playerCountRange: { min: 2 }, requireSymbol: true });

    this.boardSize = boardSize;
    this.board = [];

    this._occupied = 0;
  }

  initialize() {
    super.initialize();

    for (let i = 0; i < this.boardSize; i++) {
      this.board.push([]);
      for (let j = 0; j < this.boardSize; j++)
        this.board[i].push(null);
    }
  }

  fill(row, col) {
    if (this.board[row][col] !== null)
      throw new Error(`Trying to fill board[${row}][${col}] that has already been filled.`);

    this.board[row][col] = this.playerManager.nowPlayer.symbol;
    this._occupied++;
  }

  win(row, col) {
    return GameUtil.checkStrike(this.board, row, col, 5);
  }

  draw() {
    return this._occupied === this.boardSize ** 2;
  }
}

module.exports = Gomoku;

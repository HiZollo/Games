const Game = require('../struct/Game.js');
const { checkStrike } = require('../util/GameUtil.js');
const { GameName } = require('../util/Constants.js');

class TicTacToe extends Game {
  constructor ({ players, boardSize = 3 }) {
    if (boardSize > 5) {
      throw new Error('The size of the board should be at most 5.');
    }

    super(GameName.TIC_TAC_TOE, { players });

    this.boardSize = boardSize;
    this.playground = [];
    this.winner = null;

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

    this.playground[row][col] = this.playerHandler.nowPlayer.symbol;
    this._occupied++;
  }

  win(row, col) {
    return checkStrike(this.playground, row, col, this.boardSize);
  }

  draw() {
    return this._occupied === this.boardSize ** 2;
  }
}

module.exports = TicTacToe;

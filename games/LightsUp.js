const Game = require('../struct/Game.js');
const GameUtil = require('../util/GameUtil.js');

class LightsUp extends Game {
  constructor({ players, boardSize }) {
    super({ players, playerCountRange: [1, 1] }, ["JACKPOT"]);

    this.boardSize = boardSize;
    this.board = [];
    this.answer = [];
  }

  initialize() {
    super.initialize();

    for (let i = 0; i < this.boardSize; i++) {
      this.board.push([]);
      for (let j = 0; j < this.boardSize; j++)
        this.board[i].push(true);
    }

    for (let i = 0; i < this.boardSize; i++) {
      this.answer.push([]);
      for (let j = 0; j < this.boardSize; j++) {
        this.answer[i].push(false);
        if (GameUtil.randomInt(0, 1)) {
          this.flip(i, j);
        }
      }
    }
  }

  flip(row, col) {
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const nr = row + dr, nc = col + dc;
      if (0 <= nr && nr < this.boardSize && 0 <= nc && nc < this.boardSize) {
        this.board[nr][nc] = !this.board[nr][nc];
      }
    });
    this.answer[row][col] = !this.answer[row][col];
  }

  win() {
    for (let i = 0; i < this.boardSize; i++)
      for (let j = 0; j < this.boardSize; j++)
        if (!this.board[i][j]) return false;
    return true;
  }
}

module.exports = LightsUp;

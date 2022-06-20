import { TicTacToeInterface, TicTacToeOptions } from '../types/interfaces'
import { Game } from '../struct/Game';
import { Range } from '../struct/Range';
import { GameUtil } from '../util/GameUtil';

export class TicTacToe extends Game implements TicTacToeInterface {
  public board: (string | null)[][];
  public boardSize: number;

  private occupiedCount: number;

  constructor({ players, boardSize = 3 }: TicTacToeOptions ) {
    if (boardSize > 5) {
      throw new Error('The size of the board should be at most 5.');
    }

    super({ playerManagerOptions: { players, playerCountRange: new Range(2, Infinity), requireSymbol: true } });

    this.boardSize = boardSize;
    this.board = [];

    this.occupiedCount = 0;
  }

  initialize() {
    super.initialize();

    for (let i = 0; i < this.boardSize; i++) {
      this.board.push([]);
      for (let j = 0; j < this.boardSize; j++)
        this.board[i].push(null);
    }
  }

  fill(row: number, col: number): void {
    if (this.board[row][col] !== null)
      throw new Error(`Trying to fill board[${row}][${col}] that has already been filled.`);

    this.board[row][col] = this.playerManager.nowPlayer.symbol;
    this.occupiedCount++;
  }

  win(row: number, col: number): (string | null) {
    return GameUtil.checkStrike(this.board, row, col, this.boardSize);
  }

  draw(): boolean {
    return this.occupiedCount === this.boardSize ** 2;
  }
}
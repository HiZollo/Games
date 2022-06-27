import { HZGError, HZGRangeError, ErrorCodes } from '../errors';
import { Game, Range } from '../struct';
import { ITicTacToe, TicTacToeOptions } from '../types/interfaces'
import { GameUtil } from '../util/GameUtil';

export class TicTacToe extends Game implements ITicTacToe {
  public board: (string | null)[][];
  public boardSize: number;
  public occupiedCount: number;

  constructor({ players, boardSize = 3 }: TicTacToeOptions ) {
    if (!(1 <= boardSize && boardSize <= 5)) {
      throw new HZGRangeError(ErrorCodes.OutOfRange, "Parameter boardSize", 1, 5);
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
    if (this.board[row][col] !== null) {
      throw new HZGError(ErrorCodes.GridFilled, row, col);
    }

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
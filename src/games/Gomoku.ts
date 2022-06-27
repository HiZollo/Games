import { HZGError, HZGRangeError, ErrorCodes } from '../errors';
import { IGomoku, GomokuOptions } from '../types/interfaces'
import { Game } from '../struct/Game';
import { Range } from '../struct/Range';
import { GameUtil } from '../util/GameUtil';

export class Gomoku extends Game implements IGomoku {
  public board: (string | null)[][];
  public boardSize: number;
  public occupiedCount: number;

  constructor({ players, boardSize = 19 }: GomokuOptions ) {
    if (!(1 <= boardSize && boardSize <= 19)) {
      throw new HZGRangeError(ErrorCodes.OutOfRange, "Parameter boardSize", 1, 19);
    }

    super({ playerManagerOptions: { players, playerCountRange: new Range(2, Infinity), requireSymbol: true } });

    this.boardSize = boardSize;
    this.board = [];

    this.occupiedCount = 0;
  }

  initialize(): void {
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
    return GameUtil.checkStrike(this.board, row, col, 5);
  }

  draw(): boolean {
    return this.occupiedCount === this.boardSize ** 2;
  }
}
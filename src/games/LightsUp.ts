import { Game, Range } from '../struct';
import { ILightsUp, LightsUpOptions } from '../types/interfaces'
import { GameUtil } from '../util/GameUtil';

export class LightsUp extends Game implements ILightsUp {
  public answer: boolean[][];
  public board: boolean[][];
  public boardSize: number;

  constructor({ players, boardSize = 5 }: LightsUpOptions) {
    super({ playerManagerOptions: { players, playerCountRange: new Range(1, 1) }, gameStatus: ["JACKPOT"] });

    this.answer = [];
    this.board = [];
    this.boardSize = boardSize;
  }

  initialize(): void {
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

  flip(row: number, col: number): void {
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const nr = row + dr, nc = col + dc;
      if (0 <= nr && nr < this.boardSize && 0 <= nc && nc < this.boardSize) {
        this.board[nr][nc] = !this.board[nr][nc];
      }
    });
    this.answer[row][col] = !this.answer[row][col];
  }

  win(): boolean {
    for (let i = 0; i < this.boardSize; i++)
      for (let j = 0; j < this.boardSize; j++)
        if (!this.board[i][j]) return false;
    return true;
  }
}
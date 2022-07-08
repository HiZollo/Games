import { Game, Range } from '../struct';
import { ITofe, TofeDirections, TofeOptions } from '../types'
import { GameUtil } from '../util/GameUtil';

export class Tofe extends Game implements ITofe {
  public board: (number | null)[][];
  public boardSize: number;
  public hardMode: boolean;
  public score: number;
  public goal: number;

  protected maxNumber: number;
  protected occupiedCount: number;

  constructor({ players, hardMode = false }: TofeOptions) {
    super({ playerManagerOptions: { players, playerCountRange: new Range(1, 1) } });

    this.board = [];
    this.boardSize = 4;
    this.hardMode = hardMode;
    this.score = 0;
    this.goal = 2048;

    this.maxNumber = 1;
    this.occupiedCount = 0;
  }

  initialize(): void {
    super.initialize();

    for (let i = 0; i < this.boardSize; i++) {
      this.board.push([]);
      for (let j = 0; j < this.boardSize; j++)
        this.board[i].push(null);
    }
    this.generate();
    this.generate();
  }

  operate(direction: TofeDirections): boolean {
    let success = false;
    success = this.push(direction) || success;
    success = this.merge(direction) || success;
    success = this.push(direction) || success;
    if (success) {
      this.generate();
    }
    return success;
  }

  win(): boolean {
    return this.maxNumber >= this.goal;
  }

  lose(): boolean {
    return !this.operable();
  }
  
  protected generate(): void {
    if (this.occupiedCount >= this.boardSize ** 2) return;

    const emptySlots: ([number, number])[] = [];
    for (let i = 0; i < this.boardSize; i++)
      for (let j = 0; j < this.boardSize; j++)
        if (this.board[i][j] === null)
          emptySlots.push([i, j]);
    
    const [row, col] = emptySlots[GameUtil.randomInt(0, emptySlots.length - 1)];
    let number: number;
    if (!this.hardMode && emptySlots.length === 1) {
      const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      const numbers: number[] = [];
      for (let [dr, dc] of directions) {
        const r = row + dr, c = col + dc;
        if (0 <= r && r < this.boardSize && 0 <= c && c < this.boardSize) {
          const n = this.board[r][c];
          if (n !== null) numbers.push(n);
        }
      }
      number = numbers[GameUtil.randomInt(0, numbers.length - 1)];
    }
    else {
      number = this.randomNumber();
    }

    this.board[row][col] = number;
    this.maxNumber = Math.max(this.maxNumber, number);
    this.occupiedCount++;
  }

  protected merge(direction: TofeDirections): boolean {
    let dr, dc, rowInc, colInc, rowStart, colStart;
    switch (direction) {
      case TofeDirections.Up: 
        [dr, dc] = [1, 0];
        [rowInc, colInc] = [0, 1];
        [rowStart, colStart] = [0, 0];
        break;
      case TofeDirections.Down: 
        [dr, dc] = [-1, 0];
        [rowInc, colInc] = [0, 1];
        [rowStart, colStart] = [this.boardSize - 1, 0];
        break;
      case TofeDirections.Left: 
        [dr, dc] = [0, 1];
        [rowInc, colInc] = [1, 0];
        [rowStart, colStart] = [0, 0];
        break;
      case TofeDirections.Right: 
        [dr, dc] = [0, -1];
        [rowInc, colInc] = [1, 0];
        [rowStart, colStart] = [0, this.boardSize - 1];
        break;
    }

    let success = false;
    for (let i = rowStart, j = colStart, a = 0; a < this.boardSize; i += rowInc, j += colInc, a++)
      for (let r = i, c = j, b = 0; b < this.boardSize - 1; r += dr, c += dc, b++) {
        let number = this.board[r][c];
        if (number !== null && number === this.board[r + dr][c + dc]) {
          number *= 2;
          this.board[r][c] = number;
          this.board[r + dr][c + dc] = null;
          this.maxNumber = Math.max(this.maxNumber, number);
          this.occupiedCount--;
          this.score += number;
          success = true;
        }
      }

    return success;
  }

  protected push(direction: TofeDirections): boolean {
    let dr, dc, rowInc, colInc, rowStart, colStart;
    switch (direction) {
      case TofeDirections.Up: 
        [dr, dc] = [1, 0];
        [rowInc, colInc] = [0, 1];
        [rowStart, colStart] = [0, 0];
        break;
      case TofeDirections.Down: 
        [dr, dc] = [-1, 0];
        [rowInc, colInc] = [0, 1];
        [rowStart, colStart] = [this.boardSize - 1, 0];
        break;
      case TofeDirections.Left: 
        [dr, dc] = [0, 1];
        [rowInc, colInc] = [1, 0];
        [rowStart, colStart] = [0, 0];
        break;
      case TofeDirections.Right: 
        [dr, dc] = [0, -1];
        [rowInc, colInc] = [1, 0];
        [rowStart, colStart] = [0, this.boardSize - 1];
        break;
    }

    let success = false;
    for (let i = rowStart, j = colStart, a = 0; a < this.boardSize; i += rowInc, j += colInc, a++) {
      let prevEmptySlots: ([number, number])[] = [];
      for (let r = i, c = j, b = 0; b < this.boardSize; r += dr, c += dc, b++) {
        if (this.board[r][c] === null) {
          prevEmptySlots.push([r, c]);
        }
        else if (prevEmptySlots.length > 0) {
          const [nr, nc] = prevEmptySlots.shift() ?? [0, 0];
          this.board[nr][nc] = this.board[r][c];
          this.board[r][c] = null;
          prevEmptySlots.push([r, c]);
          success = true;
        }
      }
    }
    return success;
  }

  private randomNumber(): number {
    const random = Math.random();
    const mappedRandom = random ** 6;
    const [min, max] = [1, Math.max(2, Math.log2(this.maxNumber) - 6)];
    const power = Math.floor(mappedRandom * (max - min + 1) + min);
    return 2 ** power;
  }

  private operable(): boolean {
    if (this.occupiedCount < this.boardSize ** 2) return true;

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) return true;
        if (this.board[j][i] === this.board[j + 1][i]) return true;
      }
    }
    return false;
  }
}
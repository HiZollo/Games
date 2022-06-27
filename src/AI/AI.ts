import { getTicTacToeMove } from './getTicTacToeMove';
import { HZGError, ErrorCodes } from '../errors';
import { Range } from '../struct';
import { sleep } from '../util/Functions';

export class AI extends null {
  static async FinalCode(range: Range): Promise<number> {
    await sleep(2e3, null);
    let query: number;
    do {
      const rand = Math.random();
      const mappedRand = 4 * ((rand - 0.5)**3) + 0.5;
      query = Math.round(mappedRand * (range.max - range.min - 2) + range.min + 1);
    } while (!range.inOpenRange(query));
    return query;
  }

  static async TicTacToe(board: (string | null)[][], symbol: string | null): Promise<number[]> {
    if (symbol === null) {
      throw new HZGError(ErrorCodes.SymbolRequired);
    }

    await sleep(2e3, null);
    const transformedBoard: (1 | 0 | -1)[][] = [];
    for (let i = 0; i < board.length; i++) {
      transformedBoard.push([]);
      for (let j = 0; j < board.length; j++) {
        transformedBoard[i].push(board[i][j] === null ? 0 : (board[i][j] === symbol ? 1 : -1));
      }
    }
    
    return await getTicTacToeMove(transformedBoard);
  }
}
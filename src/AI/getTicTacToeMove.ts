import { GameUtil } from "../util/GameUtil"; 

export async function getTicTacToeMove(board: (1 | 0 | -1)[][]): Promise<number[]> {
  const size = board.length;
  let occupiedCount = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      occupiedCount += Math.abs(board[i][j]);
    }
  }
  const [r, c] = await simulate(board, 1, Math.min(6, size * size - occupiedCount));
  return [r, c];
}

async function simulate(board: (1 | 0 | -1)[][], symbol: (1 | -1), emptySlots: number): Promise<[number, number, number]> {
  const size = board.length;
  const scores: ([number, number, number])[] = [];

  if (emptySlots === 0) {
    return [-1, -1, 0];
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] !== 0) continue;
      board[i][j] = symbol;
      const winningSymbol = GameUtil.checkStrike(board, i, j, board.length);
      if (winningSymbol) {
        board[i][j] = 0;
        return [i, j, winningSymbol];
      }

      const result = await simulate(board, symbol === 1 ? -1 : 1, emptySlots - 1);
      board[i][j] = 0;
      scores.push([i, j, result[2]]);
    }
  }
  
  let results = [scores[0]];
  for (let i = 1; i < scores.length; i++) {
    if (symbol * scores[i][2] > symbol * results[0][2]) {
      results = [scores[i]];
    }
    else if (symbol * scores[i][2] === symbol * results[0][2]) {
      results.push(scores[i]);
    }
  }

  return results[GameUtil.randomInt(0, results.length - 1)];
}
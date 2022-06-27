export class GameUtil extends null {
  /**
   * Checks if a specific grid in 2D Array is lined up.
   * @param {Array<Array<T | null>>} board
   * @param {number} row the row index
   * @param {number} col the column index
   * @param {number} amount the minimum number for a symbol to make a line
   * @param {Array<Array<number>>} directions the possible directions to make a line
   * @returns {T | null} the symbol if it is lined up, null if not
   */
  static checkStrike<T>(board: (T | null)[][], row: number, col: number, amount: number, directions = [[1, 1], [1, 0], [0, 1], [-1, 1]]): (T | null) {
    const symbol = board[row][col];
    const rowCount = board.length;
    const colCount = board[row].length;

    // check if the grid is empty
    if (symbol === null) return null;

    for (let [dr, dc] of directions) {
      let currentStrike = 1;

      // walk along <dr, dc> until encountering the border or other symbols
      let [negRow, negCol] = [row - dr, col - dc];
      let [posRow, posCol] = [row + dr, col + dc];
      let negSame = (0 <= negRow && negRow < rowCount) && (0 <= negCol && negCol < colCount) && board[negRow][negCol] === symbol;
      let posSame = (0 <= posRow && posRow < rowCount) && (0 <= posCol && posCol < colCount) && board[posRow][posCol] === symbol;

      while (currentStrike < amount && (negSame || posSame)) {
        if (negSame) {
          currentStrike++;
          negRow -= dr, negCol -= dc;
          negSame = (0 <= negRow && negRow < rowCount) && (0 <= negCol && negCol < colCount) && board[negRow][negCol] === symbol;
        }
        if (posSame) {
          currentStrike++;
          posRow += dr, posCol += dc;
          posSame = (0 <= posRow && posRow < rowCount) && (0 <= posCol && posCol < colCount) && board[posRow][posCol] === symbol;
        }
      }

      if (currentStrike >= amount) {
        return symbol;
      }
    }

    return null;
  }

  /**
   * Shuffles an Array.
   * @param {Array<*>} array
   */
  static shuffle(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = GameUtil.randomInt(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Returns a random integer in [min, max].
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  static randomInt(min: number, max: number): number {
    return Math.floor((max - min + 1) * Math.random()) + min;
  }
}
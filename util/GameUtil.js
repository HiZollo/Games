class GameUtil extends null {
  /**
   * Shuffles an Array.
   * @param {Array<*>} array
   */
  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = GameUtil.randomInt(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Checks if a specific grid in 2D Array is lined up.
   * @param {Array<Array<*>>} board
   * @param {number} row the row index
   * @param {number} col the column index
   * @param {number} amount the minimum number for a symbol to make a line
   * @param {Array<Array<number>>} directions the possible directions to make a line
   * @returns {?*} the symbol if it is lined up, null if not
   */
  static checkStrike(board, row, col, totalStrike, directions = [[1, 1], [1, 0], [0, 1], [-1, 1]]) {
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

      while (currentStrike < totalStrike && (negSame || posSame)) {
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

      if (currentStrike >= totalStrike) {
        return symbol;
      }
    }

    return null;
  }

  /**
   * Returns a random integer in [min, max].
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  static randomInt(min, max) {
    return Math.floor((max - min + 1) * Math.random()) + min;
  }
}

module.exports = GameUtil;

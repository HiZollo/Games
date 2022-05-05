/**
 * Shuffles an Array.
 * @param {Array<*>} array the array to shuffle
 */
function shuffle(array) {
  const length = array.length;
  for (let i = length - 1; i > 0; i--) {
    let j = randomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Checks if a specific grid in 2D Array is lined up.
 * @param {Array<Array<*>>} board
 * @param {number} row the row number
 * @param {number} col the column number
 * @param {number} amount the minimum number for a same symbol to make a line
 * @param {Array<Array<number>>} directions the possible directions to make a line
 * @returns {?*} the symbol if it is lined up, null if not
 */
function checkStrike(board, row, col, totalStrike, directions = [[1, 1], [1, 0], [0, 1], [-1, 1]]) {
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
 * Returns a random number in [min, max]
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor((max - min + 1) * Math.random()) + min;
}

module.exports = {
  checkStrike, randomInt, shuffle
};

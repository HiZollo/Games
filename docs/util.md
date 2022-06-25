This is the documentation for all utilities.


# Table of Contents
- [GameUtil](#GameUtil)


# GameUtil
## methods
### `[static]` .checkStrike(board, row, col, totalStrike, directions)
| parameter   | type                 | default                             | description                                    |
|-------------|----------------------|-------------------------------------|------------------------------------------------|
| board       | (string \| null)[][] | *required*                          | The board array                                |
| row         | number               | *required*                          | The row index                                  |
| col         | number               | *required*                          | The column index                               |
| totalStrike | number               | *required*                          | The minimum number for a symbol to make a line |
| directions  | number[][]           | `[[1, 1], [1, 0], [0, 1], [-1, 1]]` | The possible directions to make a line         |
- Checks if a specific grid in 2D Array is lined up.
- Returns: ?* (the symbol if it is lined up, null if not)

### `[static]` .randomInt(min, max)
| parameter | type   | default    | description        |
|-----------|--------|------------|--------------------|
| min       | number | *required* | The minimum number |
| max       | number | *required* | The maximum number |
- Returns a random integer in [min, max].
- Returns: number

### `[static]` .shuffle(array)
| parameter | type | default    | description          |
|-----------|------|------------|----------------------|
| array     | \*[] | *required* | The array to shuffle |
- Shuffles an array.
- Returns: void

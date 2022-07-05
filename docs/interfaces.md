This is the documentation for all interfaces.


# Table of Contents
- [IBullsAndCows](#IBullsAndCows)
- [IFinalCode](#IFinalCode)
- [IFlipTrip](#IFlipTrip)
- [IGomoku](#IGomoku)
- [ILightsUp](#ILightsUp)
- [ITicTacToe](#ITicTacToe)


# IBullsAndCows
| parameter    | type                                                                | description                                                      |
|--------------|---------------------------------------------------------------------|------------------------------------------------------------------|
| answer       | number                                                              | The answer of the game                                           |
| answerLength | number                                                              | The length of the answer                                         |
| numberCount  | number                                                              | The number of digits that can possibly appear in the answer      |
| guess        | (number[]) => [BullsAndCowsResult](./others.md/#BullsAndCowsResult) | Compares the query with the answer                               |
| win          | ([BullsAndCowsResult](./others.md/#BullsAndCowsResult)) => boolean  | Checks if the result from the guess satisfies winning conditions |


# IFinalCode
| parameter | type                                | description                                                                                               |
|-----------|-------------------------------------|-----------------------------------------------------------------------------------------------------------|
| answer    | number                              | The answer of the game                                                                                    |
| range     | [Range](./classes/struct.md/#Range) | The range of the answer                                                                                   |
| guess     | (number) => 1 \| 0 \| -1            | Compares a number with the answer, and returns `1` if the number is larger, `-1` if smaller, `0` if equal |
| win       | () => boolean                       | Checks if the game satisfies the winning conditions                                                       |


# IFlipTrip
| parameter | type                | description                                                             |
|-----------|---------------------|-------------------------------------------------------------------------|
| boardSize | number              | The number of pieces on the board                                       |
| state     | number              | The range of the answer                                                 |
| flip      | (number) => boolean | Flips a specitic piece, and returns if the resulting state has appeared |
| win       | () => boolean       | Checks if the game satisfies the winning conditions                     |


# IGomoku
| parameter | type                               | description                                                                          |
|-----------|------------------------------------|--------------------------------------------------------------------------------------|
| board     | (string \| null)[][]               | The current state of the board                                                       |
| boardSize | number                             | The dimensions of the board                                                          |
| draw      | () => boolean                      | The range of the answer                                                              |
| fill      | (number, number) => void           | Fills a speciric location with the current player's symbol                           |
| win       | (number, number) => string \| null | Checks if any lines passing through a speciric location satisfies winning conditions |


# ILightsUp
| parameter | type                     | description                                                             |
|-----------|--------------------------|-------------------------------------------------------------------------|
| answer    | boolean[][]              | The answer to the board, `true` means the location requires a flip      |
| board     | boolean[][]              | The current state of the board, `true` means the location is lighted up |
| boardSize | number                   | The dimensions of the board                                             |
| flip      | (number, number) => void | Flips a specific location and its adjacent grids                        |
| win       | () => boolean            | Checks if the game satisfies the winning conditions                     |


# ITicTacToe
| parameter | type                               | description                                                                          |
|-----------|------------------------------------|--------------------------------------------------------------------------------------|
| board     | (string \| null)[][]               | The current state of the board                                                       |
| boardSize | number                             | The dimensions of the board                                                          |
| draw      | () => boolean                      | The range of the answer                                                              |
| fill      | (number, number) => void           | Fills a speciric location with the current player's symbol                           |
| win       | (number, number) => string \| null | Checks if any lines passing through a speciric location satisfies winning conditions |


# ITofe
| parameter | type                                                       | description                                                                       |
|-----------|------------------------------------------------------------|-----------------------------------------------------------------------------------|
| board     | (number \| null)[][]                                       | The current state of the board                                                    |
| boardSize | number                                                     | The dimensions of the board                                                       |
| hardMode  | boolean                                                    | Whether to enable hard mode                                                       |
| score     | number                                                     | The score of the game                                                             |
| operate   | ([TofeDirections](./enums.md/#TofeDirections)) => boolean  | Pushes the tiles along the given direction and returns if the operation successes |
| win       | () => boolean                                              | Checks if the game satisfies the winning conditions                               |
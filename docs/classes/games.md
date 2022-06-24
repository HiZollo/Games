This is the documentations for all game classes.


# Table of Contents
- [BullsAndCows](#BullsAndCows)
- [FinalCode](#FinalCode)
- [FlipTrip](#FlipTrip)
- [Gomoku](#Gomoku)
- [LightsUp](#LightsUp)
- [TicTacToe](#TicTacToe)


# BullsAndCows
> extends [Game](./struct.md/#Game) implements [BullsAndCowsInterface](./interfaces.md/#BullsAndCowsInterface)

The class for *Bulls and Cows*.

## constructor
```js
new BullsAndCows(bullsAndCowsOptions);
```
| parameter           | type                                                      | default    | description          |
|---------------------|-----------------------------------------------------------|------------|----------------------|
| bullsAndCowsOptions | [BullsAndCowsOptions](../options.md/#BullsAndCowsOptions) | *required* | Options for the game |

## properties
### .answer
- The answer of the game
- Type: number[]

### .answerLength
- The length of the answer
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .hardMode
- Whether the game is in hard mode
- Type: boolean

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .numberCount
- The number of digits that can possibly appear in the answer
- Type: number

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .initialize()
- Initializes the game
- Returns: void

### .guess(query)
| parameter | type     | default    | description                           |
|-----------|----------|------------|---------------------------------------|
| query     | number[] | *required* | An array with a digit in each element |
- Compares the query with the answer
- Returns: [BullsAndCowsGuessResult](../others.md/#BullsAndCowsGuessResult)

### .win(result)
| parameter | type                                                              | default    | description               |
|-----------|-------------------------------------------------------------------|------------|---------------------------|
| result    | [BullsAndCowsGuessResult](../results.md/#BullsAndCowsGuessResult) | *required* | The result from the guess |
- Checks if the result from the guess satisfies winning conditions
- Returns: boolean


# FinalCode
> extends [Game](./struct.md/#Game) implements [FinalCodeInterface](./interfaces.md/#FinalCodeInterface)

The class for *Final Code*.

## constructor
```js
new FinalCode(finalCodeOptions);
```
| parameter        | type                                                | default    | description          |
|------------------|-----------------------------------------------------|------------|----------------------|
| finalCodeOptions | [FinalCodeOptions](../options.md/#FinalCodeOptions) | *required* | Options for the game |

## properties
### .answer
- The answer of the game
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .range
- The range of the answer
- Type: [Range](./struct.md/#Range)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .initialize()
- Initializes the game
- Returns: void

### .guess(query)
| parameter | type   | default    | description            |
|-----------|--------|------------|------------------------|
| query     | number | *required* | The query from players |
- Compares the query with the answer
- Returns: 1 | 0 | -1 (1 if the query is larger than the answer, -1 if smaller, 0 if equal)

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# FlipTrip
> extends [Game](./struct.md/#Game) implements [FlipTripInterface](./interfaces.md/#FlipTripInterface)

The class for *Flip Trip*.

## constructor
```js
new FinalCode(flipTripOptions);
```
| parameter       | type                                              | default    | description          |
|-----------------|---------------------------------------------------|------------|----------------------|
| flipTripOptions | [FlipTripOptions](../options.md/#FlipTripOptions) | *required* | Options for the game |

## properties
### .boardSize
- The number of pieces on the board
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .state
- The current state of all pieces, expressed in bit form
- Type: number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .flip(location)
| parameter | type   | default    | description             |
|-----------|--------|------------|-------------------------|
| location  | number | *required* | The location of a piece |
- Flips the `location`-th piece
- Returns: boolean (whether the new state has appeared)

### .initialize()
- Initializes the game
- Returns: void

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# Gomoku
> extends [Game](./struct.md/#Game) implements [GomokuInterface](./interfaces.md/#GomokuInterface)

The class for *Gomoku*.

## constructor
```js
new Gomoku(gomokuOptions);
```
| parameter     | type                                          | default    | description          |
|---------------|-----------------------------------------------|------------|----------------------|
| gomokuOptions | [GomokuOptions](../options.md/#GomokuOptions) | *required* | Options for the game |

## properties
### .board
- The current state of the board
- Type: (string | null)[][]

### .boardSize
- The dimensions of the board
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .draw()
- Checks if the game satisfies the draw conditions
- Returns: boolean

### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .fill(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Fills location (`row`, `col`) with the current player's symbol
- Returns: void

### .initialize()
- Initializes the game
- Returns: void

### .win(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Checks if any lines passing through (`row`, `col`) satisfies winning conditions
- Returns: string | null (the winner's symbol if valid)


# LightsUp
> extends [Game](./struct.md/#Game) implements [LightsUpInterface](./interfaces.md/#LightsUpInterface)

The class for *Lights-up*.

## constructor
```js
new LightsUp(lightsUpOptions);
```
| parameter       | type                                              | default    | description          |
|-----------------|---------------------------------------------------|------------|----------------------|
| lightsUpOptions | [LightsUpOptions](../options.md/#LightsUpOptions) | *required* | Options for the game |

## properties
### .answer
- The answer to the board
- Type: boolean[][]

### .board
- The current state of the board
- Type: boolean[][]

### .boardSize
- The dimensions of the board
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .flip(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Flips (row, col) and its adjacent grids
- Returns: void

### .initialize()
- Initializes the game
- Returns: void

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# TicTacToe
> extends [Game](./struct.md/#Game) implements [TicTacToeInterface](./interfaces.md/#TicTacToeInterface)

The class for *Tic-tac-toe*.

## constructor
```js
new TicTacToe(ticTacToeOptions);
```
| parameter        | type                                                | default    | description          |
|------------------|-----------------------------------------------------|------------|----------------------|
| ticTacToeOptions | [TicTacToeOptions](../options.md/#TicTacToeOptions) | *required* | Options for the game |

## properties
### .board
- The current state of the board
- Type: (string | null)[][]

### .boardSize
- The dimensions of the board
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .draw()
- Checks if the game satisfies the draw conditions
- Returns: boolean

### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .fill(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Fills location (`row`, `col`) with the current player's symbol
- Returns: void

### .initialize()
- Initializes the game
- Returns: void

### .win(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Checks if any lines passing through (`row`, `col`) satisfies winning conditions
- Returns: string | null (the winner's symbol if valid)
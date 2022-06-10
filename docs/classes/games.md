This is the documentations for all game classes.


# Table of Contents
- [BullsAndCows](#BullsAndCows)
- [FinalCode](#FinalCode)
- [FlipTrip](#FlipTrip)
- [Gomoku](#Gomoku)
- [LightsUp](#LightsUp)
- [TicTacToe](#TicTacToe)


# BullsAndCows
> extends [Game](./struct.md/#Game)

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
- Type: Array\<number>

### .answerLength
- The length of the answer
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .hardmode
- Whether the game is in hard mode
- Type: boolean

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

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
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

## methods
### .initialize()
- Initializes the game
- Returns: void

### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .guess(query)
| parameter | type           | default    | description                           |
|-----------|----------------|------------|---------------------------------------|
| query     | Array\<number> | *required* | An array with a digit in each element |
- Compares the query with the answer
- Returns: [BullsAndCowsGuessResult](../results.md/#BullsAndCowsGuessResult)

### .win(result)
| parameter | type                                                              | default    | description               |
|-----------|-------------------------------------------------------------------|------------|---------------------------|
| result    | [BullsAndCowsGuessResult](../results.md/#BullsAndCowsGuessResult) | *required* | The result from the guess |
- Checks if the result from the guess satisfies winning conditions
- Returns: boolean


# FinalCode
> extends [Game](./struct.md/#Game)

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
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .max
- The upper bound of the interval where the answer lies
- Type: number

### .min
- The lower bound of the interval where the answer lies
- Type: number

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

## methods
### .initialize()
- Initializes the game
- Returns: void

### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .guess(query)
| parameter | type   | default    | description            |
|-----------|--------|------------|------------------------|
| query     | number | *required* | The query from players |
- Compares the query with the answer
- Returns: number (positive if query is larger than the answer, negative if smaller, `0` if equal)

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# FlipTrip
> extends [Game](./struct.md/#Game)

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
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .state
- The current state of all pieces, expressed in bit form
- Type: number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

## methods
### .initialize()
- Initializes the game
- Returns: void

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

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# Gomoku
> extends [Game](./struct.md/#Game)

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
- Type: Array\<Array\<?*>>

### .boardSize
- The dimensions of the board
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

## methods
### .initialize()
- Initializes the game
- Returns: void

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

### .win(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Fills location (`row`, `col`) with the current player's symbol
- Returns: boolean


# LightsUp
> extends [Game](./struct.md/#Game)

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
- Type: Array\<Array\<boolean>>

### .board
- The current state of the board
- Type: Array\<Array\<boolean>>

### .boardSize
- The dimensions of the board
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

## methods
### .initialize()
- Initializes the game
- Returns: void

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

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# TicTacToe
> extends [Game](./struct.md/#Game)

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
- Type: Array\<Array\<?*>>

### .boardSize
- The dimensions of the board
- Type: number

### .duration
- The duration of the game (in millisecond)
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

## methods
### .initialize()
- Initializes the game
- Returns: void

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

### .win(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Checks if any lines passing through (`row`, `col`) satisfies winning conditions
- Returns: boolean

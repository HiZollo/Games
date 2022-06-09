This is the documentations for all game classes.


# Table of Contents
- [BullsAndCows](#BullsAndCows)
- [FinalCode](#FinalCode)
- [FlipTrip](#FlipTrip)
- [Gomoku](#Gomoku)
- [LightsUp](#LightsUp)
- [TicTacToe](#TicTacToe)


# BullsAndCows
> extends [Game](./struct/#Game)

The class for *Bulls and Cows*.

## constructor
| parameter           | type                                                      | default    | description                 |
|---------------------|-----------------------------------------------------------|------------|-----------------------------|
| bullsAndCowsOptions | [BullsAndCowsOptions](../options.md/#BullsAndCowsOptions) | *required* | Options for the game        |

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
- Type: ?[Player](#Player)

### .numberCount
- The number of digits that can possibly appear in the answer
- Type: number

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](#GameStatusManager)

### .winner
- The winner of the game
- Type: ?[Player](#Player)

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
- Returns: [BullsAndCowsGuessResult](../results.md/#BullsAndCowsGuessResult)

### .win(result)
| parameter | type                                                              | default    | description               |
|-----------|-------------------------------------------------------------------|------------|---------------------------|
| result    | [BullsAndCowsGuessResult](../results.md/#BullsAndCowsGuessResult) | *required* | The result from the guess |
- Checks if the result from the guess satisfies winning conditions
- Returns: boolean

This is the documentations for all game classes that implemented with [discord.js](https://www.npmjs.com/package/discord.js).


# Table of Contents
- [DjsGame](#DjsGame)
- [DjsBullsAndCows](#DjsBullsAndCows)
- [DjsFinalCode](#DjsFinalCode)
- [DjsFlipTrip](#DjsFlipTrip)
- [DjsGomoku](#DjsGomoku)
- [DjsLightsUp](#DjsLightsUp)
- [DjsTicTacToe](#DjsTicTacToe)


# DjsGame
> extends [Game](./struct.md/#Game)

The base class for all games that are implemented with discord.js.

## constructor
```js
new Game(djsGameOptions);
```
| parameter      | type                                            | default    | description          |
|----------------|-------------------------------------------------|------------|----------------------|
| djsGameOptions | [DjsGameOptions](../options.md/#DjsGameOptions) | *required* | Options for the game |

## properties
### .client
- The client that instantiated this
- Type: Client

### `abstract` .controller
- The controller buttons
- Type: [MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)

### `abstract` .controllerMessage
- The message where the controllers are on
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](#Player) | null

### `abstract` .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](#GameStatusManager)

### `abstract` .strings
- The display strings
- Type: [GameStrings](../strings.md/#GameStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: [Player](#Player) | null

## methods
### .conclude()
- Sends a conclusion message of the game
- Returns: void

### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### `abstract` .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .initialize()
- Initializes the game
- Returns: void

### .start()
- Starts running the game
- Returns: void


# DjsBullsAndCows
> extends [DjsGame](./struct.md/#DjsGame) implements [BullsAndCowsInterface](./interfaces.md/#BullsAndCowsInterface)

The class for *Bulls and Cows*, discord.js version.

## constructor
```js
new DjsBullsAndCows(djsBullsAndCowsOptions);
```
| parameter              | type                                                            | default    | description          |
|------------------------|-----------------------------------------------------------------|------------|----------------------|
| djsBullsAndCowsOptions | [djsBullsAndCowsOptions](../options.md/#DjsBullsAndCowsOptions) | *required* | Options for the game |

## properties
### .answer
- The answer of the game
- Type: number[]

### .answerLength
- The length of the answer
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .controller
- The controller buttons
- Type: [MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)

### .controllerMessage
- The message where the controllers are on
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .content
- The content of the main message
- Type: string

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

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .numberCount
- The number of digits that can possibly appear in the answer
- Type: number

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: [BullsAndCowsStrings](../strings.md/#BullsAndCowsStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .conclude()
- Sends a conclusion message of the game
- Returns: void

### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .initialize()
- Initializes the game
- Returns: void

### .guess(query)
| parameter | type     | default    | description                           |
|-----------|----------|------------|---------------------------------------|
| query     | number[] | *required* | An array with a digit in each element |
- Compares the query with the answer
- Returns: [BullsAndCowsGuessResult](../results.md/#BullsAndCowsGuessResult)

### .start()
- Starts running the game
- Returns: void

### .win(result)
| parameter | type                                                              | default    | description               |
|-----------|-------------------------------------------------------------------|------------|---------------------------|
| result    | [BullsAndCowsGuessResult](../results.md/#BullsAndCowsGuessResult) | *required* | The result from the guess |
- Checks if the result from the guess satisfies winning conditions
- Returns: boolean


# DjsFinalCode
> extends [DjsGame](./struct.md/#DjsGame) implements [FinalCodeInterface](./interfaces.md/#FinalCodeInterface)

The class for *Final Code*, discord.js version.

## constructor
```js
new DjsFinalCode(djsFinalCodeOptions);
```
| parameter           | type                                                      | default    | description          |
|---------------------|-----------------------------------------------------------|------------|----------------------|
| djsFinalCodeOptions | [djsFinalCodeOptions](../options.md/#DjsFinalCodeOptions) | *required* | Options for the game |

## properties
### .answer
- The answer of the game
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .controller
- The controller buttons
- Type: [MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)

### .controllerMessage
- The message where the controllers are on
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .range
- The range of the answer
- Type: [Range](./struct.md/#Range)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: [FinalCodeStrings](../strings.md/#FinalCodeStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .conclude()
- Sends a conclusion message of the game
- Returns: void

### .end(status)
| parameter | type   | default    | description                |
|-----------|--------|------------|----------------------------|
| status    | string | *required* | The end status of the game |
- Ends the game with a certain status
- Returns: void

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .initialize()
- Initializes the game
- Returns: void

### .guess(query)
| parameter | type   | default    | description            |
|-----------|--------|------------|------------------------|
| query     | number | *required* | The query from players |
- Compares the query with the answer
- Returns: 1 | 0 | -1 (1 if the query is larger than the answer, -1 if smaller, 0 if equal)

### .start()
- Starts running the game
- Returns: void

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# DjsFlipTrip
> extends [DjsGame](./struct.md/#DjsGame) implements [FlipTripInterface](./interfaces.md/#FlipTripInterface)

The class for *Flip Trip*, discord.js version.

## constructor
```js
new DjsFlipTrip(djsFlipTripOptions);
```
| parameter          | type                                                    | default    | description          |
|--------------------|---------------------------------------------------------|------------|----------------------|
| djsFlipTripOptions | [DjsFlipTripOptions](../options.md/#DjsFlipTripOptions) | *required* | Options for the game |

## properties
### .boardSize
- The number of pieces on the board
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .controller
- The controller buttons
- Type: [MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)

### .controllerMessage
- The message where the controllers are on
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .state
- The current state of all pieces, expressed in bit form
- Type: number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: [FlipTripStrings](../strings.md/#FlipTripStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .conclude()
- Sends a conclusion message of the game
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

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .initialize()
- Initializes the game
- Returns: void

### .start()
- Starts running the game
- Returns: void

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# DjsGomoku
> extends [DjsGame](./struct.md/#DjsGame) implements [GomokuInterface](./interfaces.md/#GomokuInterface)

The class for *Gomoku*, discord.js version.

## constructor
```js
new DjsGomoku(djsGomokuOptions);
```
| parameter        | type                                                | default    | description          |
|------------------|-----------------------------------------------------|------------|----------------------|
| djsGomokuOptions | [DjsGomokuOptions](../options.md/#DjsGomokuOptions) | *required* | Options for the game |

## properties
### .board
- The current state of the board
- Type: (string | null)[][]
- Type: string

### .boardSize
- The dimensions of the board
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .controller
- The controller buttons
- Type: [MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)

### .controllerMessage
- The message where the controllers are on
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: [GomokuStrings](../strings.md/#GomokuStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .conclude()
- Sends a conclusion message of the game
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

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .initialize()
- Initializes the game
- Returns: void

### .start()
- Starts running the game
- Returns: void

### .win(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Checks if any lines passing through (`row`, `col`) satisfies winning conditions
- Returns: string | null (the winner's symbol if valid)


# DjsLightsUp
> extends [DjsGame](./struct.md/#DjsGame) implements [LightsUpInterface](./interfaces.md/#LightsUpInterface)

The class for *Lights-up*, discord.js version.

## constructor
```js
new DjsLightsUp(djsLightsUpOptions);
```
| parameter          | type                                                    | default    | description          |
|--------------------|---------------------------------------------------------|------------|----------------------|
| djsLightsUpOptions | [DjsLightsUpOptions](../options.md/#DjsLightsUpOptions) | *required* | Options for the game |

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

### .client
- The client that instantiated this
- Type: Client

### .controller
- The controller buttons
- Type: [MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)

### .controllerMessage
- The message where the controllers are on
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: [LightsUpStrings](../strings.md/#LightsUpStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .conclude()
- Sends a conclusion message of the game
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

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .initialize()
- Initializes the game
- Returns: void

### .start()
- Starts running the game
- Returns: void

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# DjsTicTacToe
> extends [DjsGame](./struct.md/#DjsGame) implements [TicTacToeInterface](./interfaces.md/#TicTacToeInterface)

The class for *Tic-tac-toe*, discord.js version.

## constructor
```js
new DjsTicTacToe(djsTicTacToeOptions);
```
| parameter           | type                                                      | default    | description          |
|---------------------|-----------------------------------------------------------|------------|----------------------|
| djsTicTacToeOptions | [DjsTicTacToeOptions](../options.md/#DjsTicTacToeOptions) | *required* | Options for the game |

## properties
### .board
- The current state of the board
- Type: (string | null)[][]

### .boardSize
- The dimensions of the board
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .controller
- The controller buttons
- Type: [MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)

### .controllerMessage
- The message where the controllers are on
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: [TicTacToeStrings](../strings.md/#TicTacToeStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .conclude()
- Sends a conclusion message of the game
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

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .initialize()
- Initializes the game
- Returns: void

### .start()
- Starts running the game
- Returns: void

### .win(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Checks if any lines passing through (`row`, `col`) satisfies winning conditions
- Returns: string | null (the winner's symbol if valid)
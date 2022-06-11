This is the documentations for all game classes that implemented with [discord.js](https://www.npmjs.com/package/discord.js).


# Table of Contents
- [DjsBullsAndCows](#DjsBullsAndCows)
- [DjsFinalCode](#DjsFinalCode)
- [DjsFlipTrip](#DjsFlipTrip)
- [DjsGomoku](#DjsGomoku)
- [DjsLightsUp](#DjsLightsUp)
- [DjsTicTacToe](#DjsTicTacToe)


# DjsBullsAndCows
> extends [Game](./struct.md/#Game)

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
- Type: Array\<number>

### .answerLength
- The length of the answer
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .content
- The content of the main message
- Type: string

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

### .mainMessage
- The message where most of the information are shown
- Type: [Message|https://discord.js.org/#/docs/main/stable/class/Message]

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
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: Object

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

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

### .initialize(source)
| parameter | type    | default    | description                       |
|-----------|---------|------------|-----------------------------------|
| source    | [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) \| [Message|https://discord.js.org/#/docs/main/stable/class/Message] | *required* | The source that instantiated this |
- Initializes the game with an instance of [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) or [Message|https://discord.js.org/#/docs/main/stable/class/Message]
- Returns: void

### .guess(query)
| parameter | type           | default    | description                           |
|-----------|----------------|------------|---------------------------------------|
| query     | Array\<number> | *required* | An array with a digit in each element |
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
> extends [Game](./struct.md/#Game)

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

### .duration
- The duration of the game (in millisecond)
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .mainMessage
- The message where most of the information are shown
- Type: [Message|https://discord.js.org/#/docs/main/stable/class/Message]

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

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: Object

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

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

### .initialize(source)
| parameter | type    | default    | description                       |
|-----------|---------|------------|-----------------------------------|
| source    | [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) \| [Message|https://discord.js.org/#/docs/main/stable/class/Message] | *required* | The source that instantiated this |
- Initializes the game with an instance of [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) or [Message|https://discord.js.org/#/docs/main/stable/class/Message]
- Returns: void

### .guess(query)
| parameter | type   | default    | description            |
|-----------|--------|------------|------------------------|
| query     | number | *required* | The query from players |
- Compares the query with the answer
- Returns: number (positive if query is larger than the answer, negative if smaller, `0` if equal)

### .start()
- Starts running the game
- Returns: void

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# DjsFlipTrip
> extends [Game](./struct.md/#Game)

The class for *Flip Trip*, discord.js version.

## constructor
```js
new DjsFinalCode(djsFlipTripOptions);
```
| parameter          | type                                                    | default    | description          |
|--------------------|---------------------------------------------------------|------------|----------------------|
| djsFlipTripOptions | [DjsFlipTripOptions](../options.md/#DjsFlipTripOptions) | *required* | Options for the game |

## properties
### .boardContent
- The content in the main message
- Type: string

### .boardSize
- The number of pieces on the board
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .duration
- The duration of the game (in millisecond)
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .mainMessage
- The message where most of the information are shown
- Type: [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .pieces
- The current state of the pieces

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .state
- The current state of all pieces, expressed in bit form
- Type: number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: Object

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

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

### .initialize(source)
| parameter | type    | default    | description                       |
|-----------|---------|------------|-----------------------------------|
| source    | [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) \| [Message|https://discord.js.org/#/docs/main/stable/class/Message] | *required* | The source that instantiated this |
- Initializes the game with an instance of [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) or [Message|https://discord.js.org/#/docs/main/stable/class/Message]
- Returns: void

### .start()
- Starts running the game
- Returns: void

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# DjsGomoku
> extends [Game](./struct.md/#Game)

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
- Type: Array\<Array\<?*>>

### .boardContent
- The content in the main message
- Type: string

### .boardSize
- The dimensions of the board
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .duration
- The duration of the game (in millisecond)
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .mainMessage
- The message where most of the information are shown
- Type: [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: Object

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

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

### .initialize(source)
| parameter | type    | default    | description                       |
|-----------|---------|------------|-----------------------------------|
| source    | [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) \| [Message|https://discord.js.org/#/docs/main/stable/class/Message] | *required* | The source that instantiated this |
- Initializes the game with an instance of [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) or [Message|https://discord.js.org/#/docs/main/stable/class/Message]
- Returns: void

### .start()
- Starts running the game
- Returns: void

### .win(row, col)
| parameter | type   | default    | description      |
|-----------|--------|------------|------------------|
| row       | number | *required* | The row index    |
| col       | number | *required* | The column index |
- Fills location (`row`, `col`) with the current player's symbol
- Returns: boolean


# DjsLightsUp
> extends [Game](./struct.md/#Game)

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
- Type: Array\<Array\<boolean>>

### .answerContent
- Stringified answer
- Type: string

### .board
- The current state of the board
- Type: Array\<Array\<boolean>>

### .boardComponents
- The components on the main message
- Type: Array\<[MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)>

### .boardSize
- The dimensions of the board
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .duration
- The duration of the game (in millisecond)
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .mainMessage
- The message where most of the information are shown
- Type: [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: Object

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

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

### .initialize(source)
| parameter | type    | default    | description                       |
|-----------|---------|------------|-----------------------------------|
| source    | [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) \| [Message|https://discord.js.org/#/docs/main/stable/class/Message] | *required* | The source that instantiated this |
- Initializes the game with an instance of [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) or [Message|https://discord.js.org/#/docs/main/stable/class/Message]
- Returns: void

### .start()
- Starts running the game
- Returns: void

### .win()
- Checks if the game satisfies the winning conditions
- Returns: boolean


# DjsTicTacToe
> extends [Game](./struct.md/#Game)

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
- Type: Array\<Array\<?*>>

### .boardComponents
- The components on the main message
- Type: Array\<[MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)>

### .boardSize
- The dimensions of the board
- Type: number

### .client
- The client that instantiated this
- Type: Client

### .duration
- The duration of the game (in millisecond)
- Type: ?number

### .endTime
- The end time of the game (in millisecond)
- Type: ?number

### .loser
- The loser of the game
- Type: ?[Player](./struct.md/#Player)

### .mainMessage
- The message where most of the information are shown
- Type: [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](./struct.md/#PlayerManager)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message|https://discord.js.org/#/docs/main/stable/class/Message]

### .startTime
- The start time of the game (in millisecond)
- Type: ?number

### .status
- The status manager of the game
- Type: [GameStatusManager](./struct.md/#GameStatusManager)

### .strings
- The display strings
- Type: Object

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: ?[Player](./struct.md/#Player)

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

### .initialize(source)
| parameter | type    | default    | description                       |
|-----------|---------|------------|-----------------------------------|
| source    | [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) \| [Message|https://discord.js.org/#/docs/main/stable/class/Message] | *required* | The source that instantiated this |
- Initializes the game with an instance of [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) or [Message|https://discord.js.org/#/docs/main/stable/class/Message]
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
- Returns: boolean

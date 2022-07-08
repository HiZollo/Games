This is the documentation for all game classes that implemented with [discord.js](https://www.npmjs.com/package/discord.js).


# Table of Contents
- [DjsGameWrapper](#DjsGameWrapper)
- [DjsBigTwo](#DjsBigTwo)
- [DjsBullsAndCows](#DjsBullsAndCows)
- [DjsFinalCode](#DjsFinalCode)
- [DjsFlipTrip](#DjsFlipTrip)
- [DjsGomoku](#DjsGomoku)
- [DjsLightsUp](#DjsLightsUp)
- [DjsTicTacToe](#DjsTicTacToe)
- [DjsTofe](#DjsTofe)


# DjsGameWrapper
The discord.js wrapper for all games.

## constructor
```js
new DjsGameWrapper(djsGameWrapperOptions);
```
| parameter             | type                                                          | default    | description             |
|-----------------------|---------------------------------------------------------------|------------|-------------------------|
| djsGameWrapperOptions | [djsGameWrapperOptions](../options.md/#djsGameWrapperOptions) | *required* | Options for the wrapper |

## properties
### .client
- The client that instantiated this
- Type: Client

### .subMessage
- The subordinate message, or the main message if a subordinate message does not exist in a game
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### `abstract` .strings
- The display strings
- Type: [GameStrings](../strings.md/#GameStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .conclude()
- Sends a conclusion message of the game
- Returns: Promise\<void>

### .initialize()
- Initializes the game
- Returns: Promise\<void>

### `abstract` .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .start()
- Starts running the game
- Returns: Promise\<void>


# DjsBigTwo
> extends [DjsGameWrapper](#DjsGameWrapper)

The class for *Bulls and Cows*, discord.js version.

## constructor
```js
new DjsBigTwo(djsBigTwoOptions);
```
| parameter        | type                                                | default    | description          |
|------------------|-----------------------------------------------------|------------|----------------------|
| djsBigTwoOptions | [djsBigTwoOptions](../options.md/#DjsBigTwoOptions) | *required* | Options for the game |

## properties
### .client
- The client that instantiated this
- Type: Client

### .subMessage
- The subordinate message, or the main message if a subordinate message does not exist in a game
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .strings
- The display strings
- Type: [BigTwoStrings](../strings.md/#BigTwoStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

## methods
### .conclude()
- Sends a conclusion message of the game
- Returns: Promise\<void>

### .initialize()
- Initializes the game
- Returns: Promise\<void>

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .start()
- Starts running the game
- Returns: Promise\<void>


# DjsBullsAndCows
> extends [DjsGameWrapper](#DjsGameWrapper)

The class for *Bulls and Cows*, discord.js version.

## constructor
```js
new DjsBullsAndCows(djsBullsAndCowsOptions);
```
| parameter              | type                                                            | default    | description          |
|------------------------|-----------------------------------------------------------------|------------|----------------------|
| djsBullsAndCowsOptions | [djsBullsAndCowsOptions](../options.md/#DjsBullsAndCowsOptions) | *required* | Options for the game |

## properties
### .client
- The client that instantiated this
- Type: Client

### .subMessage
- The subordinate message, or the main message if a subordinate message does not exist in a game
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .hardMode
- Whether the game is in hard mode
- Type: boolean

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .strings
- The display strings
- Type: [BullsAndCowsStrings](../strings.md/#BullsAndCowsStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

## methods
### .conclude()
- Sends a conclusion message of the game
- Returns: Promise\<void>

### .initialize()
- Initializes the game
- Returns: Promise\<void>

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .start()
- Starts running the game
- Returns: Promise\<void>


# DjsFinalCode
> extends [DjsGameWrapper](#DjsGameWrapper)

The class for *Final Code*, discord.js version.

## constructor
```js
new DjsFinalCode(djsFinalCodeOptions);
```
| parameter           | type                                                      | default    | description          |
|---------------------|-----------------------------------------------------------|------------|----------------------|
| djsFinalCodeOptions | [djsFinalCodeOptions](../options.md/#DjsFinalCodeOptions) | *required* | Options for the game |

## properties
### .client
- The client that instantiated this
- Type: Client

### .subMessage
- The subordinate message, or the main message if a subordinate message does not exist in a game
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

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
- Returns: Promise\<void>

### .initialize()
- Initializes the game
- Returns: Promise\<void>

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .start()
- Starts running the game
- Returns: Promise\<void>


# DjsFlipTrip
> extends [DjsGameWrapper](#DjsGameWrapper)

The class for *Flip Trip*, discord.js version.

## constructor
```js
new DjsFlipTrip(djsFlipTripOptions);
```
| parameter          | type                                                    | default    | description          |
|--------------------|---------------------------------------------------------|------------|----------------------|
| djsFlipTripOptions | [DjsFlipTripOptions](../options.md/#DjsFlipTripOptions) | *required* | Options for the game |

## properties
### .client
- The client that instantiated this
- Type: Client

### .subMessage
- The subordinate message, or the main message if a subordinate message does not exist in a game
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

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
- Returns: Promise\<void>

### .initialize()
- Initializes the game
- Returns: Promise\<void>

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .start()
- Starts running the game
- Returns: Promise\<void>


# DjsGomoku
> extends [DjsGameWrapper](#DjsGameWrapper)

The class for *Gomoku*, discord.js version.

## constructor
```js
new DjsGomoku(djsGomokuOptions);
```
| parameter        | type                                                | default    | description          |
|------------------|-----------------------------------------------------|------------|----------------------|
| djsGomokuOptions | [DjsGomokuOptions](../options.md/#DjsGomokuOptions) | *required* | Options for the game |

## properties
### .client
- The client that instantiated this
- Type: Client

### .subMessage
- The subordinate message, or the main message if a subordinate message does not exist in a game
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

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
- Returns: Promise\<void>

### .initialize()
- Initializes the game
- Returns: Promise\<void>

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .start()
- Starts running the game
- Returns: Promise\<void>


# DjsLightsUp
> extends [DjsGameWrapper](#DjsGameWrapper)

The class for *Lights-up*, discord.js version.

## constructor
```js
new DjsLightsUp(djsLightsUpOptions);
```
| parameter          | type                                                    | default    | description          |
|--------------------|---------------------------------------------------------|------------|----------------------|
| djsLightsUpOptions | [DjsLightsUpOptions](../options.md/#DjsLightsUpOptions) | *required* | Options for the game |

## properties
### .answered
- Whether any player has asked for the answer
- Type: boolean

### .client
- The client that instantiated this
- Type: Client

### .subMessage
- The subordinate message, or the main message if a subordinate message does not exist in a game
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

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
- Returns: Promise\<void>

### .initialize()
- Initializes the game
- Returns: Promise\<void>

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .start()
- Starts running the game
- Returns: Promise\<void>


# DjsTicTacToe
> extends [DjsGameWrapper](#DjsGameWrapper)

The class for *Tic-tac-toe*, discord.js version.

## constructor
```js
new DjsTicTacToe(djsTicTacToeOptions);
```
| parameter           | type                                                      | default    | description          |
|---------------------|-----------------------------------------------------------|------------|----------------------|
| djsTicTacToeOptions | [DjsTicTacToeOptions](../options.md/#DjsTicTacToeOptions) | *required* | Options for the game |

## properties
### .client
- The client that instantiated this
- Type: Client

### .controller
- The controller buttons
- Type: [MessageActionRow](https://discord.js.org/#/docs/main/stable/class/MessageActionRow)

### .subMessage
- The subordinate message, or the main message if a subordinate message does not exist in a game
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

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
- Returns: Promise\<void>

### .initialize()
- Initializes the game
- Returns: Promise\<void>

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .start()
- Starts running the game
- Returns: Promise\<void>


# DjsTofe
> extends [DjsGameWrapper](#DjsGameWrapper)

The class for *2048*, discord.js version.

## constructor
```js
new DjsTofe(djsTofeOptions);
```
| parameter      | type                                           | default    | description          |
|----------------|------------------------------------------------|------------|----------------------|
| djsTofeOptions |[djsTofeOptions](../options.md/#DjsTofeOptions) | *required* | Options for the game |

## properties
### .client
- The client that instantiated this
- Type: Client

### .subMessage
- The subordinate message, or the main message if a subordinate message does not exist in a game
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .loser
- The loser of the game
- Type: [Player](./struct.md/#Player) | null

### .mainMessage
- The message where most of the information are shown
- Type: ?[Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .source
- The source that instantiated this
- Type: [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) | [Message](https://discord.js.org/#/docs/main/stable/class/Message)

### .strings
- The display strings
- Type: [TofeStrings](../strings.md/#TofeStrings)

### .time
- How long to consider a player idle (in milliseconds)
- Type: number

### .winner
- The winner of the game
- Type: [Player](./struct.md/#Player) | null

## methods
### .conclude()
- Sends a conclusion message of the game
- Returns: Promise\<void>

### .initialize()
- Initializes the game
- Returns: Promise\<void>

### .getEndContent()
- Gets the content to show on the concluding message
- Returns: string

### .start()
- Starts running the game
- Returns: Promise\<void>
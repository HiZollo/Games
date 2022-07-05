This is the documentation for all basic classes.


# Table of Contents
- [Game](#Game)
- [Player](#Player)
- [PlayerManager](#PlayerManager)
- [StatusManager](#StatusManager)
- [GameStatusManager](#GameStatusManager)
- [PlayerStatusManager](#PlayerStatusManager)
- [Range](#Range)


# Game
The base class for all games.

## constructor
```js
new Game(gameOptions);
```
| parameter   | type                                      | default    | description                 |
|-------------|-------------------------------------------|------------|-----------------------------|
| gameOptions | [GameOptions](../options.md/#GameOptions) | *required* | Options for the game        |

## properties
### .duration
- The duration of the game (in millisecond)
- Type: number | null

### .endTime
- The end time of the game (in millisecond)
- Type: number | null

### .loser
- The loser of the game
- Type: [Player](#Player) | null

### .ongoing
- Whether the game is ongoing
- Type: boolean

### .playerManager
- The player manager for the game
- Type: [PlayerManager](#PlayerManager)

### .startTime
- The start time of the game (in millisecond)
- Type: number | null

### .status
- The status manager of the game
- Type: [GameStatusManager](#GameStatusManager)

### .winner
- The winner of the game
- Type: [Player](#Player) | null

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


# Player
The class representing a player.

## constructor
```js
new Player(playerOptions);
```
| parameter     | type                                          | default    | description                |
|---------------|-----------------------------------------------|------------|----------------------------|
| playerOptions | [PlayerOptions](../options.md/#PlayerOptions) | *required* | the options for the player |

## properties
### .bot
- Whether the player is a bot
- Type: boolean

### .id
- The id of the player
- Type: number | string

### .status
- The status of the player
- Type: [PlayerStatusManager](#PlayerStatusManager)

### .steps
- The total number of steps the player has made
- Type: number

### .symbol
- The symbol for the player
- Type: string | null

### .time
- The amount of time the player has spent when it is their turn (in millisecond)
- Type: number

### .username
- The username for the player
- Type: string

## methods
### .addStep(step)
| parameter | type   | default | description            |
|-----------|--------|---------|------------------------|
| step      | number | `1`     | The increment of steps |
- Adds a number of steps to the player
- Returns: void

### .addTime(time)
| parameter | type   | default | description           |
|-----------|--------|---------|-----------------------|
| time      | number | `0`     | The increment of time |
- Adds an amount of time to the player
- Returns: void


# PlayerManager
The manager handling the players.

## constructor
```js
new PlayerManager(playerManagerOptions);
```
| parameter            | type                                                        | default    | description                 |
|----------------------|-------------------------------------------------------------|------------|-----------------------------|
| playerManagerOptions | [PlayerManagerOptions](../options.md/#PlayerManagerOptions) | *required* | the options for the manager |

## properties
### .alive
- Whether there is any player still playing
- Type: boolean

### .ids
- The ids of the players
- Type: (number | string)[]

### .index
- The index of the current player
- Type: number

### .nowPlayer
- The current player
- Type: [Player](#Player)

### .playerCount
- The number of the players
- Type: number

### .players
- The players
- Type: [Player](#Player)[]

### .totalSteps
- The total number of steps that all players have made
- Type: number

### .usernames
- The usernames of the players
- Type: string[]

## methods
### .assign(n)
| parameter | type   | default    | description             |
|-----------|--------|------------|-------------------------|
| n         | number | *required* | The index of the player |
- Assigns a player as the current player
- Returns: void

### .kick(id)
| parameter | type             | default    | description          |
|-----------|------------------|------------|----------------------|
| id        | number \| string | *required* | The id of the player |
- Kicks a player from the player manager
- Returns: void

### .next(n)
| parameter | type   | default | description |
|-----------|--------|---------|-------------|
| n         | number | `1`     |             |
- Changes the current player to the `n`-th next player
- Returns: void

### .prev(n)
| parameter | type   | default | description |
|-----------|--------|---------|-------------|
| n         | number | `1`     |             |
- Changes the current player to the `n`-th previous player
- Returns: void


# StatusManager
The base class for all status manager.

## constructor
```js
new StatusManager(statusManagerOptions);
```
| parameter            | type                                                        | default | description                 |
|----------------------|-------------------------------------------------------------|---------|-----------------------------|
| statusManagerOptions | [StatusManagerOptions](../options.md/#StatusManagerOptions) | `[]`    | the options for the manager |

## properties
### .now
- The current status
- Type: string

### .statusCount
- The number of statuses in the manager
- Type: number

### .statusPool
- The status pool
- Type: Set\<string>

## methods
### .append(...status)
| parameter | type     | default | description            |
|-----------|----------|---------|------------------------|
| status    | string[] | `[]`    | The statuses to append |
- Adds statuses into the status pool
- Returns: void

### .has(status)
| parameter | type   | default | description                      |
|-----------|--------|---------|----------------------------------|
| status    | string | *none*  | The status to test for existence |
- Tests if a status is in the status pool
- Returns: boolean

### .set(status)
| parameter | type   | default    | description          |
|-----------|--------|------------|----------------------|
| status    | string | *required* | The status to set to |
- Sets the current status
- Returns: void


# GameStatusManager
> extends [StatusManager](#StatusManager)

The status manager for games, with a status pool initialized with `"ONGOING"`, `"WIN"`, `"DRAW"`, `"LOSE"`, `"STOPPED"`, `"IDLE"`, `"DELETED"` by default.

## constructor
```js
new GameStatusManager(statusManagerOptions);
```
| parameter            | type                                                        | default | description                 |
|----------------------|-------------------------------------------------------------|---------|-----------------------------|
| statusManagerOptions | [StatusManagerOptions](../options.md/#StatusManagerOptions) | `[]`    | the options for the manager |

## properties
### .now
- The current status
- Type: string

### .statusCount
- The number of statuses in the manager
- Type: number

### .statusPool
- The status pool
- Type: Set\<string>

## methods
### .append(...status)
| parameter | type     | default | description            |
|-----------|----------|---------|------------------------|
| status    | string[] | `[]`    | The statuses to append |
- Adds statuses into the status pool
- Returns: void

### .has(status)
| parameter | type   | default | description                      |
|-----------|--------|---------|----------------------------------|
| status    | string | *none*  | The status to test for existence |
- Tests if a status is in the status pool
- Returns: boolean

### .set(status)
| parameter | type   | default    | description          |
|-----------|--------|------------|----------------------|
| status    | string | *required* | The status to set to |
- Sets the current status
- Returns: void


# PlayerStatusManager
> extends [StatusManager](#StatusManager)

The status manager for players, with a status pool initialized with `"PLAYING"`, `"BOT"`, `"IDLE"`, `"LEFT"`, by default.

## constructor
```js
new PlayerStatusManager(statusManagerOptions);
```
| parameter            | type                                                        | default | description                 |
|----------------------|-------------------------------------------------------------|---------|-----------------------------|
| statusManagerOptions | [StatusManagerOptions](../options.md/#StatusManagerOptions) | `[]`    | the options for the manager |

## properties
### .now
- The current status
- Type: string

### .statusCount
- The number of statuses in the manager
- Type: number

### .statusPool
- The status pool
- Type: Set\<string>

## methods
### .append(...status)
| parameter | type     | default | description            |
|-----------|----------|---------|------------------------|
| status    | string[] | `[]`    | The statuses to append |
- Adds statuses into the status pool
- Returns: void

### .has(status)
| parameter | type   | default | description                      |
|-----------|--------|---------|----------------------------------|
| status    | string | *none*  | The status to test for existence |
- Tests if a status is in the status pool
- Returns: boolean

### .set(status)
| parameter | type   | default    | description          |
|-----------|--------|------------|----------------------|
| status    | string | *required* | The status to set to |
- Sets the current status
- Returns: void


# Range
The class that represents a range of numbers.

## constructor
```js
new Range(...status);
```
| parameter | type   | default     | description                     |
|-----------|--------|-------------|---------------------------------|
| min       | number | `-Infinity` | The lower bound of the interval |
| max       | number | `Infinity`  | The upper bound of the interval |

## properties
### .interval
- The length of the interval
- Type: number

### .max
- The upper bound of the interval
- Type: number

### .min
- The lower bound of the interval
- Type: number

## methods
### .inClosedRange(value)
| parameter | type   | default    | description        |
|-----------|--------|------------|--------------------|
| value     | number | *required* | The value to check |
- Checks if the value lies in the closed range
- Returns: boolean

### .inOpenRange(value)
| parameter | type   | default    | description        |
|-----------|--------|------------|--------------------|
| value     | number | *required* | The value to check |
- Checks if the value lies in the open range
- Returns: boolean
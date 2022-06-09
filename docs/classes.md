# Game
## constructor
```js
new Game(gameOptions, gameStatus);
```
| parameter   | type          | description                 |
|-------------|---------------|-----------------------------|
| gameOptions | GameOptions   | Options for the game        |
| gameStatus  | Array<string> | Extra statuses for the game |

## properties
### `.duration`
- The duration of the game (in millisecond)
- Type: ?number

### `.endTime`
- The end time of the game (in millisecond)
- Type: ?number

### `.loser`
- The loser of the game
- Type: ?Player

### `.ongoing`
- Whether the game is ongoing
- Type: boolean

### `.playerManager`
- The player manager for the game
- Type: PlayerManager

### `.startTime`
- The start time of the game (in millisecond)
- Type: ?number

### `.status`
- The status manager of the game
- Type: GameStatus

### `.winner`
- The winner of the game
- Type: ?Player

## methods
### `.initialize()`
- Initializes the game
- Returns: void

### `.end(status)`
| parameter   | type          | description                |
|-------------|---------------|----------------------------|
| status      | string        | The end status of the game |
- Ends the game with a certain status
- Returns: void

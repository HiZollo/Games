# General Template
To host a game, all you need is to create an instance of the game class first, then sequentially call `initialize()`, `start()` and `conclude()`, and await them. Either application commands (slash commands) and message commands work in this package - just pass them to the constructor's `source` option.

Following is a general template to create a game, for both application message commands. Notice that for different games, you should pass corresponding options for them. Quick examples of the options for each game are listed in [Examples](#Examples) section, or you can also refer to our documentations for [Options](../docs/options.md).

```js
// Suppose that there is a class called DjsGameName
const { DjsGameName } = require('@hizollo/games');

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandname === 'game') {
    const game = new DjsGameName({
      source: interaction, 
      /* Other options */
    });

    await game.initialize();
    await game.start();
    await game.conclude();
  }
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith('your-prefix')) return;

  const args = message.content.slice('your-prefix'.length).trim().split(/ +/);
  if (args[0] === 'game') {
    const game = new DjsGameName({
      source: message, 
      /* Other options */
    });

    await game.initialize();
    await game.start();
    await game.conclude();
  }
});
```
- **You can, but are not recommended to, let bots join the game, since the bot will not and cannot play the game for themselves.**
- **Player who joins multiple games in the same channel may cause problems, so it's recommended to block them off if they are trying to do so**.

# Examples
This section only covers the required options, that is, the minimum amount of settings to create a game. For more customizations, you can refer to our documentations for [Options](../docs/options.md). 

## Bulls and Cows
```js
const game = new DjsBullsAndCows({
  source: interaction ?? message, 
  players: [user] // one player only
});

await game.initialize();
await game.start();
await game.conclude();
```

## Final Code
```js
const game = new DjsFinalCode({
  source: interaction ?? message, 
  players: [user] // one or more players
});

await game.initialize();
await game.start();
await game.conclude();
```

## Flip Trip
```js
const game = new DjsFlipTrip({
  source: interaction ?? message, 
  players: [user] // one player only
});

await game.initialize();
await game.start();
await game.conclude();
```


## Gomoku
```js
const game = new DjsGomoku({
  source: interaction ?? message, 
  players: [{
    username: user.username, 
    id: user.id, 
    symbol: '⚫'
  }, {
    username: opponent.username, 
    id: opponent.id, 
    symbol: '⚪'
  }] // two or more players
});

await game.initialize();
await game.start();
await game.conclude();
```


## Lights-up
```js
const game = new DjsLightsUp({
  source: interaction ?? message, 
  players: [user] // one player only
});

await game.initialize();
await game.start();
await game.conclude();
```


## Tic-tac-toe
```js
const game = new DjsTicTacToe({
  source: interaction ?? message, 
  players: [{
    username: user.username, 
    id: user.id, 
    symbol: '❌'
  }, {
    username: opponent.username, 
    id: opponent.id, 
    symbol: '⭕'
  }] // two or more players
});

await game.initialize();
await game.start();
await game.conclude();
```


## Tofe
```js
const game = new DjsTofe({
  source: interaction ?? message, 
  players: [user] // one player only
});

await game.initialize();
await game.start();
await game.conclude();
```


# Additional Materials
- [Game Rules](./gamerules.md)
- [String Customization](./strings.md)
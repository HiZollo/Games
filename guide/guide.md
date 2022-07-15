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

# Examples
This section only covers the required options, that is, the minimum amount of settings to create a game. For more customizations, you can refer to our documentations for [Options](../docs/options.md). 

## Big Two
- `player1`, `player2`, `player3`, `player4` are instances of [`User`](https://discord.js.org/#/docs/discord.js/main/class/User).
- Bots are not allowed in this game.
- Exactly 4 players required for this game.
```js
const game = new DjsBigTwo({
  source: interaction ?? message, 
  players: [player1, player3, player3, player4]
});

await game.initialize();
await game.start();
await game.conclude();
```

## Bulls and Cows
- `user` is an instance of [`User`](https://discord.js.org/#/docs/discord.js/main/class/User).
- Exactly 1 player required for this game.
- `MESSAGE_CONTENT` intent is required.
```js
const game = new DjsBullsAndCows({
  source: interaction ?? message, 
  players: [user]
});

await game.initialize();
await game.start();
await game.conclude();
```

## Final Code
- `user` is an instance of [`User`](https://discord.js.org/#/docs/discord.js/main/class/User).
- You can let 1 or more player join this game, including multiple (different) bots.
```js
const game = new DjsFinalCode({
  source: interaction ?? message, 
  players: [user]
});

await game.initialize();
await game.start();
await game.conclude();
```

## Flip Trip
- `user` is an instance of [`User`](https://discord.js.org/#/docs/discord.js/main/class/User).
- Exactly 1 player required for this game.
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
- `user` and `opponent` are instances of [`User`](https://discord.js.org/#/docs/discord.js/main/class/User).
- You can let 2 or more player join this game.
- `MESSAGE_CONTENT` intent is required.
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
- `user` is an instance of [`User`](https://discord.js.org/#/docs/discord.js/main/class/User).
- Exactly 1 player required for this game.
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
- `user` and `opponent` are instances of [`User`](https://discord.js.org/#/docs/discord.js/main/class/User).
- You can let 2 or more player join this game.
- Bots are allowed in this game, but only when the players are 1 human v.s. 1 bot.
- `MESSAGE_CONTENT` intent is required.
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
- `user` is an instance of [`User`](https://discord.js.org/#/docs/discord.js/main/class/User).
- Exactly 1 player required for this game.
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
# @hizollo/games
[![npm version](https://img.shields.io/npm/v/@hizollo/games.svg?maxAge=3600)](https://www.npmjs.com/package/@hizollo/games)
[![Downloads](https://img.shields.io/npm/dt/@hizollo/games.svg?maxAge=3600)](https://www.npmjs.com/package/@hizollo/games)
[![Last Commit](https://img.shields.io/github/last-commit/HiZollo/Games)](https://github.com/HiZollo/Games)
[![Code Size](https://img.shields.io/github/languages/code-size/HiZollo/Games)](https://github.com/HiZollo/Games)
![License](https://img.shields.io/github/license/HiZollo/Games)

# Introduction
`HiZollo/Games` is a package that provides various games for [discord.js](https://www.npmjs.com/package/discord.js). With simple settings, your app can host games easily by importing our modules.

# Usage
```js
const { DCGameName } = require('@hizollo/games'); // There isn't a game called DCGameName in this package. It is just for demonstration.

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandname === 'game') {
    const game = new DCGameName({
      /* Options */
    });

    await game.initialize(interaction);
    await game.start();
    await game.conclude();
  }
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith('your-prefix')) return;

  const args = message.content.slice('your-prefix'.length).trim().split(/ +/);
  if (args[0] === 'game') {
    const game = new DCGameName({
      /* Options */
    });

    await game.initialize(message);
    await game.start();
    await game.conclude();
  }
});
```
- To host a game, you need to create an instance of the class first. Then sequentially call `initialize()`, `start()` and `conclude()`, and await them.
- Passing either a [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction) instance or a [Message](https://discord.js.org/#/docs/main/stable/class/Message) instance to `initialize()` works.
- For different games, you should pass corresponding options to the constructor. Those information are detailed in [this section](#Options).
- You can, but are not recommended to, let bots join the game, since the bot will not and cannot play the game for themselves.
- **Player who joins multiple games in the same channel may cause problems, so it's recommended to block them off if they are trying to do so**.

# Documentations
- [Basic Structures](./docs/classes/struct.md)
- [Games](./docs/classes/games.md)
- [Discord.js Games](./docs/classes/djsgames.md)
- [Options](./docs/options.md)
- [Utilities](./docs/util.md)
- [Game Rules](./docs/rules.md)
- [Customize Strings](./docs/strings.md)
- [Misc.](./docs/others.md)

# Quick Examples
Games that do not require symbols. You can directly pass a discord.js [User](https://discord.js.org/#/docs/main/stable/class/User) object to `player` parameter.
```js
const mystrings = require('./your/path/to/mystrings.json');

const game = new DCBullsAndCows({
  players: [interaction.user],
  time: 60e3,
  strings: mystrings.bullsAndCows,   
  hardmode: true
});

await game.initialize(interaction);
await game.start();
await game.conclude();
```

Games that require symbols. It's recommended to pass a new object to `players` parameter.
```js
const mystrings = require('./your/path/to/mystrings.json');

const game = new DCGomoku({
  players: [{
    username: interaction.user.username,
    id: interaction.user.id,
    symbol: '⚫'
  }, {
    username: opponent.username,
    id: opponent.id,
    symbol: '⚪'
  }],
  time: 60e3,
  strings: mystrings.ticTacToe,   
  hardmode: true
});

await game.initialize(interaction);
await game.start();
await game.conclude();
```

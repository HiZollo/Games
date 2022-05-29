# Introduction
`HiZollo/Games` is a package that provides various games for discord.js. With simple configurations, your app can host games easily by importing our modules.

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
* To host a game, you need to create an instance of the class first. Then sequentially call `initialize()`, `start()` and `conclude()`, and await them.
* Passing either a `CommandInteraction` instance or a `Message` instance into `initialize()` works.
* For different games, you should pass the corresponding options to the constructor. Those information are detailed in [this section](#Options).
* You can, but not recommended to, let bots join the game, since the bot will not and cannot play the game for themselves.
 * We might create AI algorithm in the future.

# Options
## gameOptions
### DCBullsAndCows
```js
new DCBullsAndCows({
                // required | default value | description
  players,      // yes      |               | an array of playerOptions
  time,         // yes      |               | how long to consider a player idle, in milliseconds
  strings,      // no       | strings.json  | the strings to show on your app
  hardmode,     // no       | false         | whether to start this game in hard mode
  answerLength, // no       | 4             | how long should the answer key be
  numberCount   // no       | 10            | how many different numbers to choose to make an answer key
})
```

### DCFinalCode
```js
new DCFinalCode({
                // required | default value | description
  players,      // yes      |               | an array of playerOptions
  time,         // yes      |               | how long to consider a player idle, in milliseconds
  strings,      // no       | strings.json  | the strings to show on your app
  min,          // no       | 1             | the minimum number can the final code be (exclusive)
  max           // no       | 1000          | the maximum number can the final code be (exclusive)
})
```

### DCFlipTrip
```js
new DCFlipTrip({
                // required | default value | description
  players,      // yes      |               | an array of playerOptions
  time,         // yes      |               | how long to consider a player idle, in milliseconds
  strings,      // no       | strings.json  | the strings to show on your app
  boardSize     // no       | 3             | the number of checks on the board
})
```

### DCGomoku
```js
new DCGomoku({
                // required | default value | description
  players,      // yes      |               | an array of playerOptions
  time,         // yes      |               | how long to consider a player idle, in milliseconds
  strings,      // no       | strings.json  | the strings to show on your app
  boardSize     // no       | 9             | the dimension of the board
})
```

### DCLightsUp
```js
new DCLightsUp({
                // required | default value | description
  players,      // yes      |               | an array of playerOptions
  time,         // yes      |               | how long to consider a player idle, in milliseconds
  strings,      // no       | strings.json  | the strings to show on your app
  boardSize     // no       | 9             | the dimension of the board
})
```

### DCTicTacToe
```js
new DCTicTacToe({
                // required | default value | description
  players,      // yes      |               | an array of playerOptions
  time,         // yes      |               | how long to consider a player idle, in milliseconds
  strings,      // no       | strings.json  | the strings to show on your app
  boardSize     // no       | 3             | the dimension of the board
})
```

## playerOptions
```js
{
                // required | default value | description
  username,     // no       | 'Player'      | the player's username
  id,           // yes      |               | the player's id, it's recommended to be distinctive
  symbol,       // no       | null          | the symbol for the player in chessboard-like games
  bot           // no       | false         | whether the player is a bot
}
```

## strings
In this package, you can customize what string should display when certain events happen, like, someone wins a game or makes a wrong guess. To be more specific, in default settings, all strings displayed on Discord are located in [strings.json](./strings.json), but you can overwrite them by passing corresponding objects into `constructor#strings`.

For example, if you want to change the string that shows when someone hit the answer in Final Code, you can do this:
```js
const game = new DCFinalCode({
  players: [
    player1, player2, player3
  ],
  time: 15e3,
  strings: { // this will overwrite the default object
    endMessages: {
      win: "Oh no, %1s! You hit the final code %2s!"
    }
  }
});
```

You might notice that there are substrings `%1s` and `%2s` in it, and those are called specifiers. Usually, the specifiers represent substrings that vary from game to game, such as the player's name, scores, etc. In this case, `%1s` represents username and `%2s` represents the answer. It's ok to discard some specifiers if you prefer, and this will not break the functionality.

If you are planning to make a bot in languages other than English, feel free to copy the content of [strings.json](./strings.json), translate them into any language you want, and create your own json file, say, `mystrings.json`. Then, you can include them into your game as below:
```js
const mystrings = require('./your/path/to/mystrings.json');
const game = new DCFinalCode({
  players: [
    player1, player2, player3
  ],
  time: 15e3,
  strings: mystrings.finalCode
});
```

# Examples
Games that do not require symbols. You can directly pass a discord.js `User` object into `player` parameter.
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

Games that require symbols. It's recommended to pass a new object into `player` parameter.
```js
const mystrings = require('./your/path/to/mystrings.json');

const game = new DCTicTacToe({
  players: [{
    username: interaction.user.username,
    id: interaction.user.id,
    symbol: '❌'
  }, {
    username: opponent.username,
    id: opponent.id,
    symbol: '⭕'
  }],
  time: 60e3,
  strings: mystrings.bullsAndCows,   
  hardmode: true
});

await game.initialize(interaction);
await game.start();
await game.conclude();
```

# Game Rules



# Notice
* Player that joins multiple games in the same channel may cause problems, so it's recommended to block them off if they are trying to do so.
* If you fail to fulfill the restrictions of the games, it may not work as expected.

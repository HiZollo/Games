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
- To host a game, you need to create an instance of the class first. Then sequentially call `initialize()`, `start()` and `conclude()`, and await them.
- Passing either a `CommandInteraction` instance or a `Message` instance into `initialize()` works.
- For different games, you should pass the corresponding options to the constructor. Those information are detailed in [this section](#Options).
- You can, but not recommended to, let bots join the game, since the bot will not and cannot play the game for themselves.
 - We might create AI algorithm in the future.
- **Player that joins multiple games in the same channel may cause problems, so it's recommended to block them off if they are trying to do so**.

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
  answerLength  // no       | 4             | how long should the answer key be
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
In this package, you can customize what string should display when certain events happen, like, someone wins a game or makes a wrong guess. To be more specific, in default settings, all strings displayed on Discord are located in [strings.json](./util/strings.json), but you can overwrite them by passing corresponding objects into `gameOptions#strings`.

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

If you are planning to make a bot in languages other than English, feel free to copy the content of [strings.json](./util/strings.json), translate them into any language you want, and create your own json file, say, `mystrings.json`. Then, you can include them into your game as below:
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
  strings: mystrings.ticTacToe,   
  hardmode: true
});

await game.initialize(interaction);
await game.start();
await game.conclude();
```

# Game Restrictions and Rules
There are some restrictions to the games, **if you fail to fulfill the restrictions of the games, it may not work as expected**. Also, the rules of the games may be different from those you are used to/familiar with, so make sure check them out below.

## Bulls and Cows
### Restrictions
- `player`'s length: `1`
- `answerLength`: `[1, 10]`

### Rules
The bot will generate a random number with the length of `answerLength`, every digit within the number is distinctive, and the number can start with `0`. The player can make several queries, and the goal is to get the exact number in as fewer guesses as possible.

In each query, player should type a number with the length of `answerLength`, and every digit is distinctive. Otherwise, the query is invalid and the bot will not response. After that, the bot will return a string `mAnB`, saying that there are `m` A's and `n` B's. It means that in the query, there are `m` matching digits that are in the right location, and `n` matching digits that are in the wrong location.

For example, suppose that the answer is `2019`.
- The player guesses `1234`, the response will be `0A2B`. Because both `1` and `2` are in the answer, but not in the correct location.
- The player guesses `2098`, the response will be `2A1B`. Because `2`, `0` and `9` are in the answer, but only `2` and `0` are in the correct location, while `9` is not.

Whenever a player guesses the answer correctly, the game ends.

## Final Code
### Restrictions
- `max - min` is greater than or equal to `2`

### Rules
The bot will generate a random answer key in open interval `(min, max)`. The players take turns to call a number. After that, the bot will tell you the number is smaller or larger than the key, so the interval will shrink accordingly. Notice that it is allowed to guess a number that is not in the current interval.

For example, suppose that the answer key is `602`, and the interval is `(1, 1000)`.
- Player A calls `400`. It's too small, so the interval will shrink to `(400, 1000)`.
- Player B calls `800`. It's too large, so the interval will shrink to `(400, 800)`.

Whenever a player guesses the answer key, the game ends.

## Flip Trip
### Restrictions
- `player`'s length: `1`
- `boardSize`: less than or equal to `10`

### Rules
There are `n` checks on the board. All of them have two sides: white one facing up and black on facing down. When a button is pressed, the corresponding check will be flipped from white to black or from black to white. The goal is to get each possible permutation of the checks (`2^n` permutations) without encountering a permutation that has appeared before.

For example, say `n = 3`, so the initial state is ⚪⚪⚪.
- If a player flips check 1, 2 and 3 sequentially, the checks will turn out to be ⚪⚪⚫, ⚪⚫⚫, ⚫⚫⚫ sequentially.
- If a player flips check 1, 1 sequentially, the checks will turn out to be ⚪⚪⚫, ⚪⚪⚪ sequentially. Since ⚪⚪⚪ already appears before, the player loses the game.

Whenever all permutations have shown exactly once, the game ends.

## Gomoku
## Restrictions
- `player`'s length: `2` or more, but `2` is recommended
 - `symbol` is required
- `boardSize`: less than or equal to `19`
 - If you want to host a gomoku game with `boardSize` larger than `10`, you should pass your custom row and column symbol into `strings.row` and `strings.column`, because Discord default emoji does not cover numbers from 11 to 19.

### Rules
The players take turns to place their pieces on the board. Players can send messages like `a3` or `g7` in chat to place a piece. The first player who forms a consecutive line (vertically, horizontally or diagonally) of 5 or more pieces wins.

## Lights-up
## Restrictions
- `player`'s length: `1`
- `boardSize`: less than or equal to `5`

### Rules
There are n*n bulbs, with some of them randomly lighted (blue ones). When you click on a bulb, the bulb itself and the adjacent bulbs will flip (turn off if it was on or turn on if it was off). Two bulbs are adjacent if they share common edge. The goal is to light up all bulbs.

## Tic-tac-toe
### Restrictions
- `player`'s length `2` or more, but `2` is recommended
 - `symbol` is required
- `boardSize`: less than or equal to `4`

### Rules
The players take turns to place their pieces on the board (by clicking the button). The first player who forms a consecutive line (vertically, horizontally or diagonally) across the board wins.

In this package, you can customize display strings when certain events happen, like, someone wins a game or makes a wrong guess. To be more specific, in default settings, all strings displayed on Discord are located in [strings.json](../util/strings.json), but you can overwrite them by passing corresponding objects to `gameOptions#strings`.

For example, if you want to change the string that shows when someone hit the answer in *Final Code*, you can do:
```js
const game = new DjsFinalCode({
  players: [
    player1, player2, player3
  ],
  time: 15e3,
  strings: { // this will overwrite the default object
    endMessages: {
      win: "Oh no, <player>! You hit the final code <answer>!"
    }
  }
});
```

You might notice that there are substrings `<player>` and `<answer>` in it, and those are called specifiers. Usually, the specifiers represent substrings that vary from game to game, such as the player's name, scores, etc. It's ok to discard some specifiers if you prefer, which will not break the functionality.

If you are planning to make a bot in languages other than English, feel free to copy the content of [strings.json](../util/strings.json), translate them into any language you want, and create your own json file, say, `mystrings.json`. Then, you can include them in your game as below:
```js
const mystrings = require('./your/path/to/mystrings.json');
const game = new DjsFinalCode({
  players: [
    player1, player2, player3
  ],
  time: 15e3,
  strings: mystrings.finalCode
});
```

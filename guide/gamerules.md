This is the documentations for the game rules.


# Table of Contents
- [Bulls and Cows](#Bulls-and-Cows)
- [Final Code](#Final-Code)
- [Flip Trip](#Flip-Trip)
- [Gomoku](#Gomoku)
- [Lights-up](#Lights-up)
- [Tic-tac-toe](#Tic-tac-toe)
- [2048](#2048)


# Bulls and Cows
The game will generate a random number with the length of `answerLength` (default: `4`), all digits in it are distinctive, and it can start with `0`. The player can make several queries, and the goal is to get the exact number in as fewer guesses as possible.

In each query, player gives a number with the length of `answerLength`, and every digit is distinctive. Otherwise, the query is invalid and an error will be thrown. After that, the game will return a hint `mAnB`, saying that there are `m` A's and `n` B's. It means that in the query, there are `m` matching digits that are in the right location, and `n` matching digits that are in the wrong location.

For example, suppose that the answer is `2019`.
- The player guesses `1234`, the hint will be `0A2B`. Because both `1` and `2` are in the answer, but not in the correct location.
- The player guesses `2098`, the hint will be `2A1B`. Because `2`, `0` and `9` are in the answer, but only `2` and `0` are in the correct location, while `9` is not.

Whenever a player guesses the answer correctly, the game ends.

## Discord.js version
- You need to type number queries in chat, and make sure the numbers meet the requirements (no duplicated number, and the length is equal to the answer), or the app will not response.
- You can click on the red button to leave the game.
- You can enable hardmode in this discord.js version, which will only keep the last hint to the answer.


# Final Code
The game will generate a random answer key in an open interval `(min, max)` (default: `(1, 1000)`). The players take turns to call a number. After that, the game will tell you the number is smaller or larger than the key, so the interval will shrink accordingly.

For example, suppose that the answer key is `602`, and the interval is `(1, 1000)`.
- Player A calls `400`. It's too small, so the interval will shrink to `(400, 1000)`.
- Player B calls `800`. It's too large, so the interval will shrink to `(400, 800)`.

Whenever a player guesses the answer key, the game ends.

## Discord.js version
- You need to type number queries in chat, and make sure the numbers meet the requirements (the number should lie inside the open interval).
- You can click on the red button to leave the game.
- You can let bots join the game too, they will automatically guess a number.


# Flip Trip
There are `n` (default: `3`) pieces on the board. All of them have two sides: white one facing up and black one facing down. You can flipt a piece from white to black or from black to white in each round. The goal is to get each possible permutation of the colors (`2^n` permutations) without encountering a permutation that has appeared before.

For example, say `n = 3`, so the initial state is ⚪⚪⚪.
- If a player flips piece 1, 2 and 3 sequentially, the pieces will turn out to be ⚪⚪⚫, ⚪⚫⚫, ⚫⚫⚫ sequentially.
- If a player flips piece 1, 1 sequentially, the pieces will turn out to be ⚪⚪⚫, ⚪⚪⚪ sequentially. Since ⚪⚪⚪ already appears before, the player loses the game.
- One possible solution for `n = 3` is 1, 2, 3, 2, 1, 2, 3.

Whenever all permutations have shown exactly once, the game ends.

## Discord.js version
- You need to click on the blue buttons to flip a piece.
- You can click on the red button to leave the game.


# Gomoku
The players take turns to place their pieces on the board. The first player who forms a consecutive line (vertically, horizontally or diagonally) of 5 or more pieces wins.

## Discord.js version
- You need to type grid labels in chat to place your piece on that grid. The labels consist of an alphabet and a number, such as `a3` or `g7`.
  - Notice that invalid labels will be ignored. For example, the game won't do anything if you type `f10`, but the size of the board is `9*9`.
- You can click on the red button to leave the game.


# Lights-up
There are `n*n` (default `5*5`) bulbs, with some of them randomly lighted. When you toggle a bulb, the bulb itself and the adjacent bulbs will all be toggled, turning from on to off or from off to on. Two bulbs are adjacent if they share a common edge. The goal is to light up all bulbs.

## Discord.js version
- You need to click on the blue buttons to toggle the bulbs (the bulb itself and its adjacent bulbs).
- You can click on the green button to reveal the answer (instructions of how to toggle the bulbs), or click on the red button to leave the game.


# Tic-tac-toe
The players take turns to place their pieces on the board. The first player who forms a consecutive line (vertically, horizontally or diagonally) across the board wins.

## Discord.js version
- You need to click on the blue buttons to place your piece on the board.
- You can click on the red button to leave the game.
- You can let bots join the game too, they will automatically place their pieces. However, in this case, there can only be 2 players in the game. One is a human, and the other is the bot.

# 2048
This game is called `Tofe` in the source code, which is "two-o-four-eight" for short.

The game starts with two random number tiles on a 4*4 board. In each round, the player can push all tiles towards up, down, left, or right. After that, all tiles will pile up against corresponding side. If two tiles with the same number are piled together, they will merge and become a new tile, with the number doubled. If there are any tiles successfully pushed or merged, a new tile with a random number (guaranteed to be a power of 2) will spawn in a random empty grid afterwards. The maximum value of newly spawned number increases as the game goes on. To win the game, you need to create a `2048` tile. If there board is full and any pair of tiles cannot be merged, the player loses.

The game rules above are describing games with hard mode enabled. By default, hard mode is disabled, and you will never lose in this game mode. It's guaranteed that you can always successfully push or merge at least one tile.

## Discord.js version
- You need to click on buttons on the controller to push & merge the tiles.
- Buttons that displays numbers are unclickable.
- You can click on the red button to leave the game.
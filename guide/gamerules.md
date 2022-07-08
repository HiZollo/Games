This is the documentations for the game rules.


# Table of Contents
- [Big Two](#Big-Two)
- [Bulls and Cows](#Bulls-and-Cows)
- [Final Code](#Final-Code)
- [Flip Trip](#Flip-Trip)
- [Gomoku](#Gomoku)
- [Lights-up](#Lights-up)
- [Tic-tac-toe](#Tic-tac-toe)
- [2048](#2048)


# Big Two
This is a poker game that only allows 4 players to play. When the game starts, each player gets 13 cards. Starts with the player with 3♣️ in hand, players take turns to play tricks, and the first one runs out of cards wins. In each round, a player can play one trick. All legal tricks are listed below:
- Single: any card from the deck, ordered by rank with suit being tie-breaker.
- Pair: 2 cards with the same rank, ordered by rank with the highest suit being tie-breaker.
- Straight: any 5 cards with consecutive ranks, suits don't matter.
  - The order of straights: **2**-3-4-5-6 > 10-J-Q-K-**A** > 9-10-J-Q-**K** > ... > 4-5-6-7-**8** > 3-4-5-6-**7** > A-2-3-4-**5**.
  - J-Q-K-A-2, Q-K-A-2-3, K-A-2-3-4 are **Not** valid straights.
  - The suit of the highest rank in a straight is the tie-breaker.
- Full House: 3 cards with same rank + 2 cards with another rank.
  - **3-3-3**-A-A and **2-2-2**-7-7 are both valid full houses.
  - The order is determined by the rank of the triple.
- Four-of-a-kind: 4 cards with same rank + 1 other card.
  - **4-4-4-4**-2 and **7-7-7-7**-5 are both valid four-of-a-kinds.
  - The order is determined by the rank of the 4 card set.
- Straight flush: a straight but all 5 cards are in the same suit.

The order of the ranks is 2 > A > K > Q > J > 10 > ... > 4 > 3, and the order of the suits is ♠ > ♥ > ♦ > ♣. The first player can play any trick they want. However, in most circumstances, the following players should only play the same trick as the previous player's, but with a higher order. For example, [3♥, 3♠] can be played after [3♣, 3♦], and [7♦, 8♥, 9♦, 10♣, 11♠] can be played after [4♣, 5♦, 6♣, 7♥, 8♥]. 

Two special tricks are four-of-a-kind and straight flush. A four-of-a-kind can be played after any single, pair, straight or full house, and a straight flush can be played after any tricks just mentioned, plus four-of-a-kind. For example, [3♣, 3♦, 3♥, 3♠, 4♦] can be played after [2♣, 2♥, 2♠, A♣, A♠], and [A♣, 2♣, 3♣, 4♣, 5♣] can then be played after [3♣, 3♦, 3♥, 3♠, 4♦].

Players can also pass, meaning that they cannot/don't want to play cards in this round. If player A plays a trick, and the other three players pass, player A can then play any trick they want. 

## Discord.js version
- To reveal your poken hands, you need to click on the gray button on the main message. Then, a ephemeral message (message that only you can see) with a select menu and two buttons will emerge.
- To play cards, you need to first select the cards you want to play in the select menu. When it is in your turn, click on the green button the play the cards you have just selected, or you can also click on the red button to pass.
- You can click on the red button on the main message to leave the game.


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
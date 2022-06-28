This is the documentations for the game rules.


# Table of Contents
- [Bulls and Cows](#Bulls-and-Cows)
- [Final Code](#Final-Code)
- [Flip Trip](#Flip-Trip)
- [Gomoku](#Gomoku)
- [Lights-up](#Lights-up)
- [Tic-tac-toe](#Tic-tac-toe)


# Bulls and Cows
The game will generate a random number with the length of `answerLength`, all digits in it are distinctive, and it can start with `0`. The player can make several queries, and the goal is to get the exact number in as fewer guesses as possible.

In each query, player should type a number with the length of `answerLength`, and every digit is distinctive. Otherwise, the query is invalid and the game will not response. After that, the game will return a string `mAnB`, saying that there are `m` A's and `n` B's. It means that in the query, there are `m` matching digits that are in the right location, and `n` matching digits that are in the wrong location.

For example, suppose that the answer is `2019`.
- The player guesses `1234`, the response will be `0A2B`. Because both `1` and `2` are in the answer, but not in the correct location.
- The player guesses `2098`, the response will be `2A1B`. Because `2`, `0` and `9` are in the answer, but only `2` and `0` are in the correct location, while `9` is not.

Whenever a player guesses the answer correctly, the game ends.

## Discord.js version
To interact with the game, you need to type the numbers in chat, and make sure the numbers meet the requirements (no duplicated number, and the length is equal to the answer). You can click on the red button to stop the game.


# Final Code
The game will generate a random answer key in open interval `(min, max)`. The players take turns to call a number. After that, the game will tell you the number is smaller or larger than the key, so the interval will shrink accordingly.

For example, suppose that the answer key is `602`, and the interval is `(1, 1000)`.
- Player A calls `400`. It's too small, so the interval will shrink to `(400, 1000)`.
- Player B calls `800`. It's too large, so the interval will shrink to `(400, 800)`.

Whenever a player guesses the answer key, the game ends.

## Discord.js version
To interact with the game, you need to type the numbers in chat, and make sure the numbers meet the requirements (the number should lie inside the interval). You can click on the red button to ask for stopping the game. 

You can let bots join the game too, they will automatically guess a number.


# Flip Trip
There are `n` pieces on the board. All of them have two sides: white one facing up and black one facing down. When a button is pressed, the corresponding piece will be flipped from white to black or from black to white. The goal is to get each possible permutation of the colors (`2^n` permutations) without encountering a permutation that has appeared before.

For example, say `n = 3`, so the initial state is ⚪⚪⚪.
- If a player flips piece 1, 2 and 3 sequentially, the pieces will turn out to be ⚪⚪⚫, ⚪⚫⚫, ⚫⚫⚫ sequentially.
- If a player flips piece 1, 1 sequentially, the pieces will turn out to be ⚪⚪⚫, ⚪⚪⚪ sequentially. Since ⚪⚪⚪ already appears before, the player loses the game.
- One possible solution when `n = 3` is 1, 2, 3, 2, 1, 2, 3.

Whenever all permutations have shown exactly once, the game ends.

## Discord.js version
To interact with the game, you need to click on the blue buttons to flip a piece. You can also click on the red button to stop the game.

# Gomoku
The players take turns to place their pieces on the board. The first player who forms a consecutive line (vertically, horizontally or diagonally) of 5 or more pieces wins.

## Discord.js version
To interact with the game, you need to type grid labels in chat to place your piece on that grid. The labels consist of an alphabet and a number, such as `a3` or `g7`. Notice that invalid labels will be ignored. For example, the game won't do anything if you type `f10`, but the size of the board is 9*9. You can click on the red button to ask for stopping the game. 


# Lights-up
There are n*n bulbs, with some of them randomly lighted. When you click on a bulb, the bulb itself and the adjacent bulbs will flip (turn off if it was on or turn on if it was off). Two bulbs are adjacent if they share common edge. The goal is to light up all bulbs.

## Discord.js version
To interact with the game, you need to click on the blue buttons to toggle the bulbs (the bulb itself and its adjacent bulbs). You can click on the green button to check the answer, or click on the red button to stop the game.


# Tic-tac-toe
The players take turns to place their pieces on the board. The first player who forms a consecutive line (vertically, horizontally or diagonally) across the board wins.

## Discord.js version
To interact with the game, you need to click on the blue buttons to place your piece on the board. You can click on the red button to ask for stopping the game. 

You can let bots join the game too, they will automatically place their pieces. However, in this case, there can only be 2 players in the game. One is a human, and the other is the bot.